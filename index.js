const core = require('@actions/core');
const github = require('@actions/github');

function shouldMerge(pullRequest, mergeLabel) {
  const { labels, draft, mergeable_state: mergeableState, state } = pullRequest;

  logObject('shouldMerge params', { labels, draft, mergeableState, state });

  return (
    containsLabel(labels, mergeLabel) &&
    state == 'open' &&
    !draft &&
    mergeableState == 'mergeable'
  );
}

function containsLabel(labels, label) {
  return labels.find(l => l.name == label);
}

function logObject(label, thing) {
  console.log(label, JSON.stringify(thing, undefined, 2));
}

async function updateBranch(client, prNumber) {
  console.log('Updating branch.....................');
  await client.pulls.updateBranch(prNumber);
}

try {
  const mergeLabel = core.getInput('mergeLabel', { required: true });
  const token = core.getInput('repoToken', { required: true });
  const shouldUpdateBranch = core.getInput('shouldUpdateBranch', {
    required: true,
  });
  const client = new github.GitHub(token);
  const { pull_request: pullRequest } = github.context.payload;
  const merge = shouldMerge(pullRequest, mergeLabel);

  logObject(';;;;;; pull request', pullRequest);

  // TODO: check if update is actually required before calling it
  if (shouldUpdateBranch) {
    await updateBranch(client, pullRequest.number);
  }

  core.setOutput('shouldMerge', merge);
  console.log('shouldMerge????', merge);
} catch (error) {
  core.setFailed(error.message);
}
