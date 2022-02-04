const core = require('@actions/core');
// const github = require('@actions/github');
const { v4: uuidv4 } = require('uuid');
const { CloudFrontClient, ListDistributionsCommand, CreateInvalidationCommand} = require("@aws-sdk/client-cloudfront");
const client = new CloudFrontClient({});
const listCommand = new ListDistributionsCommand({});
const target_domain = core.getInput('target-domain', { required: true });
const invalidation_paths = core.getInput('paths', { required: false }).split(',');

function getDistroId(DistributionList, domain) {
  for (distro in DistributionList.Items) {
    for (alias in DistributionList.Items[distro].Aliases.Items) {
      if (DistributionList.Items[distro].Aliases.Items[alias] == domain) {
        return DistributionList.Items[distro].Id;
      }
    }
  }
  return null;
}

async function invalidate(distId, paths) {
  let invalidationCommandInput = {
    DistributionId: distId,
    InvalidationBatch: {
      CallerReference: uuidv4(),
      Paths: {
        Items: paths,
        Quantity: paths.length
      }
    }
  }
  let invalidationCmd = new CreateInvalidationCommand(invalidationCommandInput);

  try {
    response = await client.send(invalidationCmd)
    return response.Invalidation
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function main () {
  try {
    const distros = await client.send(listCommand);
    let distroId = getDistroId(distros.DistributionList, target_domain);
    let resp = await invalidate(distroId, invalidation_paths)
    console.log(resp)
  } catch (error) {
    core.setFailed(error.message)
  }
}

if (require.main === module) {
  main();
}
