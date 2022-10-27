export const isPositiveInteger = (id: string) => {
  return id && /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(id);
};

/**
 * Thinking should be set in the pipeline in something like gitlab.yml or github actions
 */
export const percentage = process.env.PERCENTAGE || '0.25';
export const defaultLimit = process.env.DEFAULT_LIMIT || '2';
