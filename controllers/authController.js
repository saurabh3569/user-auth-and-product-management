const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getCountryByIP } = require("../utils/geolocation");
const {
  getOtpRepository,
  getUserRepository,
} = require("../src/repositories/repository");

const restrictedCountries = ["Syria", "Afghanistan", "Iran"];

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;

    const country = getCountryByIP(ip);
    if (restrictedCountries.includes(country)) {
      return res
        .status(403)
        .json({ message: "Registration not allowed from your country." });
    }

    const userRepo = getUserRepository();
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use." });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepo.create({
      email,
      password: hashedPassword,
      country,
    });

    await userRepo.save(newUser);

    const otp = await sendOTP({ userId: newUser.id });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      otp,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userRepo = getUserRepository();

    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { otp, userId } = req.body;

    const otpRepo = getOtpRepository();
    const otpEntry = await otpRepo.findOne({
      where: { user: { id: userId }, code: otp },
    });

    if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > new Date(otpEntry.expires_at))
      return res.status(400).json({ message: "OTP expired" });

    // Mark user as verified
    const userRepo = getUserRepository("User");
    await userRepo.update(userId, { is_verified: true });

    // Delete used OTP
    await otpRepo.delete({ id: otpEntry.id });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};

const sendOTP = async (req) => {
  const { userId } = req;
  const length = 6;
  const code = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length);

  const otpRepo = getOtpRepository();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  const otp = otpRepo.create({
    userId,
    code,
    expires_at: expiresAt,
    user: { id: userId },
  });

  await otpRepo.save(otp);

  return code;
};

module.exports = { signup, login, verifyOTP };
