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
