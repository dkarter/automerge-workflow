const core = require('@actions/core');
const github = require('@actions/github');

function shouldMerge(pullRequest, mergeLabel) {
  const { labels, draft, mergeable_state: mergeableState, state } = pullRequest;

  console.log(':::: pullRequest', JSON.stringify(pullRequest, undefined, 2));
  console.log('mergeLabel', JSON.stringify(mergeLabel, undefined, 2));

  return (
    labels.includes(mergeLabel) &&
    state == 'open' &&
    !draft &&
    mergeableState == 'mergeable'
  );
}

try {
  const mergeLabel = core.getInput('mergeLabel');
  const { pull_request: pullRequest } = github.context.payload;
  const merge = shouldMerge(pullRequest, mergeLabel);

  core.setOutput('merge', merge);
  console.log('merge', merge);
} catch (error) {
  core.setFailed(error.message);
}
