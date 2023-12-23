const githubAccount = 'johnwargo';

module.exports = async function () {

  const appName = 'github-repos-sample-authenticated';
  var currentPage = 0;
  var done = false;
  var repoURL = '';
  var result = [];

  // get API key from the environment
  const apiKey = process.env.GITHUB_API_KEY;
  // make sure we have an API key
  if (!apiKey) {
    console.error(`[${appName}] Error: Missing GITHUB_API_KEY environment variable`);
    process.exit(1);
  }
  // setup fetch options
  const options = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'User-Agent': appName
    }
  };

  console.log(`Fetching GitHub repositories for ${githubAccount} (authenticated)`);
  // loop until the last page (fetch returns no repositories)
  while (!done) {
    repoURL = `https://api.github.com/users/${githubAccount}/repos?per_page=100&page=${++currentPage}`;
    console.log(`Fetching ${repoURL}`);
    var response = await fetch(repoURL, options);
    var tempRes = await response.json();
    if (response.status == 200) {
      if (tempRes.length === 0) {
        done = true;
      } else {
        console.log(`Retrieved metadata for ${tempRes.length} repos`);
        result = result.concat(tempRes);
      }
    } else {
      console.error(`\nError: ${response.status} - ${response.statusText}\n`);
      if (tempRes.message) console.log(tempRes.message, tempRes.documentation_url);
      process.exit(1);
    }
  }
  console.log(`Retrieved metadata for ${result.length} repos`);
  return result;
};