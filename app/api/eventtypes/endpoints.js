import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import EventType from './model';

export default null;

/**
 * List all event types
 */
export const findAll = (req, res) => {
  validator(req.query, blueprint.get.all)
    .then((validated) => {
      const { where, limit, projection } = queryBuilder(validated);

      EventType.find(where)
        .limit(limit)
        .select(projection)
        .then(rows => res.status(200).json(rows))
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};
