import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

import blueprint from './blueprint';
import { validator, queryBuilder, getPasswordErrors, isEmail } from '../helpers';

import Admission from '../admissions/model';
import User from './model';

/**
 * List all users
 */
export const findAll = (req, res) => {
  validator(req.query, blueprint.get.all)
    .then((validated) => {
      const { where, limit, projection } = queryBuilder(validated);

      User.find(where)
        .limit(limit)
        .select(projection)
        .then(rows => res.status(200).json(rows))
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * List one user by id
 */
export const findOne = (req, res) => {
  validator(req.query, blueprint.get.one)
    .then((validated) => {
      const { projection } = queryBuilder(validated);

      User.findOne({ _id: req.params.id })
        .select(projection)
        .then((user) => {
          if (!user) {
            res.status(404).end(`Couldn't find user with id '${req.params.id}'`);
          } else {
            res.status(200).json(user);
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * List the user relative to the sent token
 */
export const findMe = (req, res) => {
  validator(req.query, blueprint.get.me)
    .then((validated) => {
      const { projection } = queryBuilder(validated);

      User.findOne({ _id: req.decodedToken._id })
        .select(projection)
        .then((user) => {
          if (!user) {
            res.status(404).end(`Couldn't find user with id '${req.decodedToken._id}'`);
          } else {
            res.status(200).json(user);
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Add new user
 */
export const add = (req, res) => {
  validator(req.body, blueprint.post.add)
    .then((validated) => {
      User.findOne({ email: validated.email })
        .then((knownUser) => {
          const passwordErrors = getPasswordErrors(validated.password);
          const emailErrors = isEmail(validated.email);

          if (knownUser) {
            res.status(409).end(`A user exists with ${validated.email} as email.`);
          } else if (passwordErrors) {
            res.status(406).end(`Password ${passwordErrors}.`);
          } else if (emailErrors) {
            res.status(400).end(emailErrors);
          } else {
            bcrypt.hash(validated.password, null, null, (hashError, hash) => {
              const updatedUser = { ...validated, password: hash };
              const user = new User(updatedUser);

              user.save((err) => {
                if (err) {
                  res.status(500).json(err);
                } else {
                  res.status(200).json(updatedUser);
                }
              });
            });
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Update one user by id
 */
export const update = (req, res) => {
  if (req.decodedToken._id !== req.params.id) {
    res.status(403).end(`User with id '${req.decodedToken._id}' attempted to upddate '${req.params.id}'`);
  } else {
    bcrypt.hash(req.body.password, null, null, (hashError, hash) => {
      const body = req.body;
      body.password = hash;
      validator(body, blueprint.patch.one)
        .then((validated) => {
          User.update({ _id: req.params.id }, { $set: validated })
            .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
            .catch(e => res.status(500).json(e));
        })
        .catch(e => res.status(400).json(e));
    });
  }
};

/**
 * Remove one user by id
 */
export const remove = (req, res) => {
  if (req.decodedToken._id !== req.params.id) {
    res.status(403).end(`User with id '${req.decodedToken._id}' attempted to remove '${req.params.id}'`);
  } else {
    User.findOne({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(404).end(`Couldn't find user with id '${req.params.id}'`);
        } else {
          user.remove()
            .then(() => {
              res.status(200).json(user);
            })
            .catch(e => res.status(500).json(e));
        }
      })
      .catch(e => res.status(500).json(e));
  }
};

/**
 * Authenticate a user and create token
 */
export const authenticate = (req, res) => {
  validator(req.body, blueprint.post.authenticate)
    .then((validated) => {
      User.findOne({ email: validated.email })
        .then((user) => {
          if (!user) {
            res.status(404).end(`Couldn't find user with id '${req.params.id}'`);
          } else {
            // check if password matches
            bcrypt.compare(validated.password, user.password, (err, matches) => {
              if (matches) {
                const token = jwt.sign(user, process.env.DB_SECRET, {
                  expiresIn: '1 day',
                });

                Admission.findOneAndUpdate({ userId: user._id },
                                           { userId: user._id, token },
                                           { upsert: true })
                  .then(() => {
                    res.status(200).json({
                      success: true,
                      message: 'Sucessfully created token',
                      token,
                    });
                  })
                  .catch(e => res.status(500).json(e));
              } else {
                res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
              }
            });
          }
        })
        .catch(e => res.status(404).json(e));
    })
    .catch(e => res.status(500).json(e));
};
