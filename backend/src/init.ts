// const { PrismaClient } = require("@prisma/client");
import { PrismaClient } from "@prisma/client";

var CryptoJS = require("crypto-js");
const prisma = new PrismaClient();

async function main(
  name: string = "albert",
  inpassword: string = "secret",
  inRoom: string = "default",
  inquestion: string = "question "
) {
  var userID = "";
  const createUser = await prisma.users.create({
    data: {
      email: name + "@gmail.com",
      first_name: name + " John",
      last_name: "Santos",
      password: CryptoJS.AES.encrypt(
        inpassword,
        process.env.API_KEY
      ).toString(),
      username: "Jinwusan",
    },
  });
  const createToken = await prisma.token.create({
    data: {
      usersId: createUser.id,
    },
  });
  const createquiz: any = await prisma.quiz
    .create({
      data: {
        title: "all about me",
        password: "",
        room: inRoom,
        status: "closed",
        creator_id: createUser.id,
        start_at: new Date(),
        ends_at: new Date(),
      },
    })
    .catch((e) => {
      console.log(e);
    });

  const createAnsweredQuiz = await prisma.answeredQuiz.create({
    data: {
      Score: 20,
      quizId: createquiz.id,
      usersId: createUser.id,
    },
  });

  for (let index = 0; index < 3; index++) {
    const createQuestion = await prisma.question.create({
      data: {
        content: `${name} ${inquestion} ${index + 1}`,
        score: 1,
        quizId: createquiz.id,
      },
    });
    const createChoice = await prisma.choice.createMany({
      data: [
        {
          content: "meow no",
          is_correct: false,
          questionId: createQuestion.id,
        },
        {
          content: "meow yes",
          is_correct: true,
          questionId: createQuestion.id,
        },
        {
          content: "meow i don't know",
          is_correct: false,
          questionId: createQuestion.id,
        },
      ],
    });
    const readChoice: any = await prisma.choice
      .findMany({
        where: {
          questionId: createQuestion.id,
        },
      })
      .then((datas) => {
        return datas[Math.floor(Math.random() * datas.length)];
      });
    console.log(readChoice);
    console.log("end");
    const createAnswer = await prisma.answer.create({
      data: {
        quizId: createquiz.id,
        questionId: createQuestion.id,
        choiceId: readChoice.id,
        usersId: createUser.id,
        answeredQuizId: createAnsweredQuiz.id,
      },
    });
  }

  console.log("data initilized");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
main("jlo", "secret101", "dungeon", "who am i")
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

main("mark", "albert!", "amazing room", "scc join now")
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
