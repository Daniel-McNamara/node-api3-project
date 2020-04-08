const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log("User Post Error", err);
      res.status(500).json({
        message: "There was an error saving the user to the database",
        error: err
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postData = { ...req.body, user_id: req.params.id };
  Posts.insert(postData)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error saving the post to the database",
        error: err
      });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "error, the users information could not be retrieved",
        error: err
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "error, the user info could not be retrieved",
        error: err
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log("user posts get error", err);
      res.status(500).json({
        message: "error, we were unable to retrieve posts for this user",
        error: err
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(num => {
      res.status(200).json(req.user);
    })
    .catch(err => {
      console.log("user delete error", err);
      res.status(500).json({
        message: "error, the user was not removed from the database",
        error: err
      });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(num => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      console.log("user put error", err);
      res.status(500).json({
        message: "error, changes to the user were not saved to database",
        error: err
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.get()
    .then(users => {
      if (
        users.filter(user => user.id === Number(req.params.id)).length === 0
      ) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = users.filter(user => user.id === Number(req.params.id))[0];
        next();
      }
    })
    .catch(err => console.log(err));
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
