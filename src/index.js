const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const createJwt = require("./jwt");
const { default: axios } = require("axios");
const config = require("./utils/config");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport(config.smtp);

app.post("/email/send", async (req, res) => {
  try {
    const messengerUrl = config.messengerUrl;
    const { name, email, userId } = req.body;
    console.log('email-send=> ',req.body);

    if (!userId || !email || !name) {
      res.status(400).send({ message: "name, email and userId required" });
    }

    const link = `${messengerUrl}?userId=${userId}&jwtToken=${createJwt(
      userId
    )}&name=${encodeURIComponent(name)}`;
    console.log(link);

    const mailOptions = {
      from: "services@experience.avaya.com",
      //   to: email,
      to: "vivekn@bravishma.com",
      subject: "Avaya Services",
      text: `
Hi ${name},

We have notices that your ID card has been expired.
Please update your card by clicking this link: ${link}  at the earliest to receive uninterrupted service.

Thanks
Beyond Services
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).send({ message: "Email sent Successfully ", info });
  } catch (error) {
    console.log("/ - Error=> ", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const usersData = config.usersData;
    const { userId, password } = req.body;
    console.log('login==> ',req.body);

    if (!userId || !password) {
      return res.status(400).send({ message: "Email and Password required" });
    }

    const usersResp = await axios.get(usersData);
    const users = usersResp.data;

    const user = users.find(
      (ele) => ele.userId === userId && ele.password === password
    );
    console.log("==========>", user);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const jwtToken = createJwt(userId);
    // console.log(jwtToken);

    user.jwtToken = jwtToken;

    res.status(200).send(user);
  } catch (error) {
    console.log("/ - Error=> ", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(3010, () => console.log("server running"));
