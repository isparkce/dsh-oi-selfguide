const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetPkg = require.resolve('@isparkce/dsh-oi-selfguide/package.json');
const submoduleDir = path.join(path.dirname(targetPkg), submoduleName);
const gitmodulesPath = path.join(__dirname, '..', '.gitmodules');

const docsPath = path.join(submoduleDir, 'docs');
const mkdocsPath = path.join(submoduleDir, 'mkdocs.yml');

if (fs.existsSync(docsPath) && fs.existsSync(mkdocsPath)) {
    console.log(`[oi-wiki] 已存在完整内容，跳过。`);
    process.exit(0);
}

let repoUrl = 'https://github.com/OI-wiki/OI-wiki.git';
if (fs.existsSync(gitmodulesPath)) {
    const match = fs.readFileSync(gitmodulesPath, 'utf8').match(/path\s*=\s*[^\n]+\s*\n\s*url\s*=\s*([^\n]+)/);
    if (match) repoUrl = match[1].trim();
}

console.log(`[oi-wiki] 正在从 ${repoUrl} (master) 拉取文件...`);

try {
    if (fs.existsSync(submoduleDir)) {
        fs.rmSync(submoduleDir, { recursive: true, force: true });
    }
    fs.mkdirSync(submoduleDir, { recursive: true });

    const execOpts = { cwd: submoduleDir, stdio: 'inherit' };
    
    execSync('git init', execOpts);
    execSync(`git remote add origin ${repoUrl}`, execOpts);
    
    // 启用非 cone 模式的稀疏检出
    execSync('git config core.sparseCheckout true', execOpts);
    
    const sparseCheckoutPath = path.join(submoduleDir, '.git', 'info', 'sparse-checkout');
    fs.writeFileSync(sparseCheckoutPath, `/*\n!/docs/\n!/mkdocs.yml\n`);

    execSync('git fetch --depth 1 origin master', { ...execOpts, stdio: 'pipe' });
    execSync('git checkout master', execOpts);
    fs.rmSync(path.join(submoduleDir, '.git'), { recursive: true, force: true });
    
    console.log('[oi-wiki] 拉取完成。');
} catch (error) {
    console.error('[oi-wiki] 安装失败，请检查网络或代理设置。');
    console.error(error.message);
    process.exit(0);
}