const { nanoid } = require("nanoid");
// const { hash } = require("./hash");

const pg = require("knex")({
  client: "pg",
  connection: process.env.DB_CONNECTION,
});

exports.createUser = async (user_name, password) => {
  try {
    const user = await pg("users")
      .where({ user_name })
      .limit(1)
      .then((data) => {
        return data[0];
      })
      .catch((e) => {
        console.log(e);
      });
    // console.log(user);
    if (user) {
      return false;
    } else {
      return await pg("users")
        .insert({
          user_name: user_name,
          password: pg.raw(`crypt('${password}', gen_salt('md5'))`),
        })
        .returning(["id", "user_name"])
        .then((data) => {
          return data[0];
        });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.findByUserName = async (user_name, password) => {
  return await pg
    .select("*")
    .from("users")
    .where("user_name", user_name)
    .andWhere("password", pg.raw(`crypt('${password}', password)`))
    // .raw(`SELECT * FROM users WHERE users.user_name = ${user_name} AND password = crypt('${password}', password)`)
    .limit(1)
    .then((data) => {
      return data[0];
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.findBySession = async (session_id) => {
  const session = await pg("sessions")
    .select("user_id")
    .where({ session_id })
    .limit(1)
    .then((data) => {
      return data.length > 0 ? data[0] : false;
    })
    .catch((e) => {
      console.log(e);
    });
  // console.log("session-->", session);

  if (!session) {
    return;
  }

  return await pg("users")
    .where({ id: session.user_id })
    .limit(1)
    .then((data) => {
      return data[0];
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.createSession = async (user_id) => {
  const session_id = nanoid();
  await pg("sessions")
    .insert({
      user_id,
      session_id,
    })
    .catch((e) => {
      console.log(e);
    });
  return session_id;
};

exports.deleteSession = async (session_id) => {
  await pg("sessions")
    .where({ session_id })
    .delete()
    .catch((e) => {
      console.log(e);
    });
};

exports.getTimers = async (userid, active) => {
  return await pg("timers")
    .where({ user_id: userid, isActive: active })
    .then((data) => {
      return data
        ? data.map((el) => {
            el.start = parseInt(el.start);
            el?.end ? (el.end = parseInt(el.end)) : false;
            el?.progress ? (el.progress = parseInt(el.progress)) : false;
            if (el.isActive) {
              el.progress = Date.now() - el.start;
            }
            return el;
          })
        : [];
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.createTimer = async (userId, description) => {
  return await pg("timers")
    .insert({
      start: Date.now(),
      description,
      isActive: true,
      user_id: userId,
    })
    .returning(["id"])
    .then((data) => {
      // console.log("timer id--->", data);
      return data[0].id;
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.stopTimer = async (userId, timerId) => {
  const date = Date.now();
  // console.log(userId, timerId);
  await pg("timers")
    .where({ user_id: userId, id: timerId })
    .update({
      isActive: false,
      end: date,
      duration: pg.raw(`${date} - start`),
    })
    .catch((e) => {
      console.log(e);
      return false;
    });
  return true;
};
