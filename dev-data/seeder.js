/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
const fs = require('fs');
const faker = require('faker');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Answer = require('../models/answerModel');
const Tag = require('../models/tagModel');
const Comment = require('../models/commentModel');
const LikeDislike = require('../models/likeDislikeModel');

dotenv.config({ path: '../config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected succesfully');
  })
  .catch((err) => {
    console.log(err);
  });

const importData = async () => {
  try {
    function genTag() {
      const lol = [
        'javascript',
        'python',
        'faunadb',
        'java',
        'aws',
        'c#',
        'lol',
        'elasticsearch',
        'html',
        'css',
        'graphql',
        'c++',
        'c',
        'arduino',
        'azure',
        'cloud',
        'docker',
        'kubernetes',
        'hello',
        'rest',
        'pandas',
        'numpy',
        'tensorflow',
        'scikit-learn',
        'hasura',
        'mongoose',
        'database',
        'sql',
        'mysql',
        'postgresql',
        'wordpress',
        'drupal',
        'php',
        'google cloud platform',
        'minecraft',
        'unity',
        'unreal-engine',
        'webdev',
        'soap',
        'oop',
        'fp',
        'photoshop',
        'google',
        'algorithms',
        'data-structures',
        'ds&algo',
        'react',
        'angular',
        'vue',
        'react-native',
        'svelte',
        'emberjs',
        'mvc',
        'nodejs',
        'django',
        'flask',
        'postman',
        'apollo',
        'apache-spark',
        'apache-benchmark',
        'redis',
        'neo4j',
        'xamarin',
        'kotlin',
        'ios',
        'swift',
        'android',
        'dart',
        'flutter',
        'gdscript',
        'godot',
        'pygame',
        'lua',
        'love2d',
        'opengl',
        'data-science',
        'machine-learning',
        'assembly',
        'ssd',
        'julia',
        'golang',
        'turtle',
        'graphics',
        'ram',
        'hardware',
        'math',
        'physics',
        'server',
        'linux',
        'ethical-hacking',
        'kali-linux',
        'shell',
        'oculus',
        'shader',
      ];
      const i = [];
      s = [1, 2, 3, 4, 5];
      for (let j = 0; j < s[Math.floor(Math.random() * s.length)]; j++) {
        i.push(lol[Math.floor(Math.random() * lol.length)]);
      }

      return [...new Set(i)];
    }
    for (let i = 0; i < 40; i++) {
      await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'test1234',
        passwordConfirm: 'test1234',
        bio: faker.lorem.sentences(3),
        location: `${faker.address.city()}, ${faker.address.country()}`,
        workStatus: faker.name.jobTitle(),
        company: faker.company.companyName(),
        links: {
          github: '',
          website: '',
          instagram: '',
          facebook: '',
          twitter: '',
        },
      });
    }
    const users = await User.find({});
    for (let i = 0; i < 60; i++) {
      let content = faker.lorem.paragraph(5);
      const p = await Post.create({
        title: faker.lorem.sentence(),
        content: content,
        contentWordCount: content.length,
        postedBy: users[Math.floor(Math.random() * users.length)].id,
        tags: genTag(),
      });
    }

    const posts = await Post.find({});

    for (let i = 0; i < 40; i++) {
      const post = posts[Math.floor(Math.random() * posts.length)];
      let content = faker.lorem.paragraph(5);
      const answer = await Answer.create({
        content,
        contentWordCount: content.length,
        postedBy: users[Math.floor(Math.random() * users.length)].id,
        post: post.id,
      });

      post.answerCount = await Answer.countDocuments({ post: post.id });

      await post.save();
    }

    const answers = await Answer.find({});
    for (let i = 0; i < 200; i++) {
      let forModel = ['Post', 'Answer'][Math.floor(Math.random() * 2)];
      let doc;
      if (forModel === 'Post') {
        doc = posts[Math.floor(Math.random() * posts.length)].id;
      } else {
        doc = answers[Math.floor(Math.random() * answers.length)].id;
      }

      await LikeDislike.create({
        type: ['like', 'dislike'][Math.floor(Math.random() * 2)],
        user: users[Math.floor(Math.random() * users.length)].id,
        for: forModel,
        doc,
      });
    }

    for (let i = 0; i < 60; i++) {
      let forModel = 'Answer';
      let doc;

      doc = answers[Math.floor(Math.random() * answers.length)].id;

      await Comment.create({
        for: forModel,
        doc,
        content: faker.lorem.sentence(),
        postedBy: users[Math.floor(Math.random() * users.length)].id,
      });
    }
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    for (let ans in await Answer.find({})) {
      await Answer.findByIdAndDelete(ans._id);
    }
    await Comment.deleteMany({});
    await LikeDislike.deleteMany({});
    console.log('deleted data successfully😉😉😉');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
