// CPH-NG custom path script (Competitive Companion imports only).
//
// Enable it in VS Code settings, pointing at this file's real path:
//   "cph-ng.companion.customPathScript": "/path/to/dsh-oi-selfguide/tools/cph-path.js"
// (CPH-NG also expands ${workspace}, ${home}, ${tmp}, and ${extensionPath} in
// the setting; use an absolute path when the package lives outside the workspace)
//
// Layout produced:
//   P1002/P1002.cpp
//   1234A/1234A.cpp
//   abc123_a/abc123_a.cpp
//   qoj1234/qoj1234.cpp
//   <sanitized-title>/<sanitized-title>.cpp
//
// Keep the cache next to the source with:
//   "cph-ng.problem.problemFilePath": "${workspace}/${relativeDirname}/${basename}.bin"
//   "cph-ng.problem.testcaseFilePath": "${workspace}/${relativeDirname}/${basename}.${id}.${ext}"
//
// This only decides where a newly imported source file is created.
// Existing open files keep their own path; CPH-NG's cache follows the source path.

const process = async () => {
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return 'No workspace folder found';
  }

  let folder = workspaceFolders[0].path;
  if (workspaceFolders.length > 1) {
    const selected = await ui.chooseItem(
      workspaceFolders.map((f) => f.name),
      'Select a workspace folder for problems',
    );
    const picked = workspaceFolders.find((f) => f.name === selected);
    if (!picked) return 'No workspace folder selected';
    folder = picked.path;
  }

  const ext = 'cpp';
  const safeBase = (value) =>
    (utils.sanitize(value || '')
      .replace(/\s+/g, '_')
      .replace(/^[._]+|[._]+$/g, '') || 'problem').slice(0, 80);

  const results = [];

  for (const problem of problems) {
    const { name, url } = problem;
    let id = null;
    let known = false;

    try {
      if (url) {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        const isHost = (h) => host === h || host.endsWith(`.${h}`);

        if (isHost('luogu.com.cn')) {
          const m = u.pathname.match(/\/problem\/([A-Za-z0-9_]+)/);
          if (m) id = m[1];
        } else if (isHost('codeforces.com')) {
          const m = u.pathname.match(
            /\/(?:contest|problemset\/problem|gym)\/(\d+)\/problem\/([A-Za-z0-9]+)/,
          );
          if (m) id = (u.pathname.includes('/gym/') ? 'gym' : '') + m[1] + m[2];
        } else if (isHost('atcoder.jp')) {
          const m = u.pathname.match(/\/tasks\/([A-Za-z0-9_]+)/);
          if (m) id = m[1];
        } else if (isHost('qoj.ac')) {
          const m = u.pathname.match(/\/problem\/([A-Za-z0-9_]+)/);
          if (m) id = `qoj${m[1]}`;
        }
      }
    } catch (e) {
      logger.warn('cph-path: URL parse failed', url, e && e.message ? e.message : e);
    }

    if (id) known = true;
    else id = safeBase(name);

    let dest = path.join(folder, id, `${id}.${ext}`);

    // Unknown OJ or unparsable URL: never overwrite an existing file.
    if (!known) {
      const base = id;
      let n = 2;
      while (fs.existsSync(dest)) {
        id = `${base}-${n}`;
        dest = path.join(folder, id, `${id}.${ext}`);
        n += 1;
      }
    }

    logger.info('cph-path: resolved', { name, url, dest });
    results.push(dest);
  }

  return results;
};
