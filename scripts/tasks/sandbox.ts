import { pathExists, remove } from 'fs-extra';

import { Task } from '../task';

const logger = console;

export const sandbox: Task = {
  before: ({ link }) => (link ? ['bootstrap-repo'] : ['bootstrap-repo', 'registry-repo']),
  async ready({ sandboxDir }) {
    return pathExists(sandboxDir);
  },
  async run(details, options) {
    if (await this.ready(details)) {
      logger.info('🗑  Removing old sandbox dir');
      await remove(details.sandboxDir);
    }
    const { create, install, addStories } = await import('./sandbox-parts');

    await create(details, options);
    await install(details, options);
    await addStories(details, options);
  },
};