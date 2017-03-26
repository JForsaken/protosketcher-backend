import { zipObj, has, pick, keys, omit } from 'ramda';

/*
 * Validates the sent JSON body with the destination endpoint's API blueprint
 */
export const validator = (body, blueprint) => (
  new Promise((resolve, reject) => {
    // omit all keys not present in blueprint and validate required keys
    const validated = pick(keys(blueprint).map((r) => {
      if (blueprint[r] === 'required' && !has(r)(body)) {
        reject(`The "${r}" key is required.`);
      }
      return r;
    }), body);

    resolve(validated);
  })
);

/*
 * Validates the send JSON body with the destination endpoint's API blueprint
 */
export const queryBuilder = (body) => {
  const where = omit(['attributes', 'limit', 'populate'], body);
  const limit = Number(body.limit);
  const projection = body.attributes &&
        zipObj(body.attributes.split(','), new Array(body.attributes.split(',').length).fill(1));
  const populate = body.populate &&
        body.populate.split(',').reduce((acc, curr) => `${acc} ${curr}`, '');
  return {
    where: where || {},
    projection: projection || {},
    limit: limit || 0,
    populate: populate || '',
  };
};

/*-----------------------*/
/* ~ String validation ~ */
/*-----------------------*/

const isMaxLengthValid = (value, length) => (
  value.length > length ? `length exceeds ${length} characters` : null
);

const isMinLengthValid = (value, length) => (
  value.length < length ? `length is below ${length} characters` : null
);

const containsUpperCase = (value, flag) => (
  (flag
   && !/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(value))
    ? 'requires at least one upper case and lower case letter'
    : null
);

const containsSpecial = (value, flag) => (
  (flag
   && !/[!@#$%^&*()_+]+/.test(value))
    ? 'requires at least one special character (!@#$%^&*()_+)'
    : null
);

const containsDigit = (value, flag) => (
  (flag
   && !/(?=.*\d)/.test(value))
    ? 'requires at least one digit'
    : null
);

export const isEmail = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address.' : null
);

export const getPasswordErrors = (password) => {
  const errors = [
    isMinLengthValid(password, 8),
    isMaxLengthValid(password, 25),
    containsUpperCase(password, false),
    containsSpecial(password, false),
    containsDigit(password, false),
  ];

  return errors.some(o => o !== null) ? errors.find(o => o !== null) : null;
};

