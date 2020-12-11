import { task, series, src, dest } from 'gulp';
import download from 'gulp-download';
import { execSync } from 'child_process';
import unzip from 'gulp-unzip';
import rename from 'gulp-rename';
import del from 'del';
import ui5preload from 'gulp-ui5-preload';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import conventionalGithubReleaser from 'conventional-github-releaser';
const execa = require('execa');
const fs = require('fs');
const { promisify } = require('util');
import dotenv from 'dotenv';

const result = dotenv.config();

console.log(result);

if (result.error) {
  throw result.error;
}

let CONFIG = {
  PRESET: 'angular',
  STDIO: 'inherit',
};

task('BUMP_VERSION', (done) => {
  conventionalRecommendedBump(
    {
      preset: `${CONFIG.PRESET}`,
    },
    (error, recommended) => {
      execa(
        'npm',
        ['version', recommended.releaseType, '--no-git-tag-version'],
        {
          stdio: `${CONFIG.STDIO}`,
        },
      ).then((result) => {
        done();
      });
    },
  );
});

task('CHANGELOG', (done) => {
  execa(
    'npx',
    [
      'conventional-changelog',
      '--preset',
      CONFIG.PRESET,
      '--infile',
      'CHANGELOG.md',
      '--same-file',
    ],
    { stdio: `${CONFIG.STDIO}` },
  ).then((result) => {
    done();
  });
});

task('GITHUB_RELEASE', (done) => {
  console.log(process.env.GH_TOKEN);
  conventionalGithubReleaser(
    { type: 'oauth', token: process.env.GH_TOKEN },
    { preset: CONFIG.PRESET },
    done,
  );
});

task('COMMIT_TAG_PUSH', (done) => {
  // Read package.json
  fs.readFile('package.json', (err, file) => {
    const { version } = JSON.parse(file);
    const commitMsg = `chore: release ${version}`;
    execa('git', ['add', '.'], {
      stdio: `${CONFIG.STDIO}`,
    }).then((commit) => {
      execa('git', ['commit', '--message', commitMsg], {
        stdio: `${CONFIG.STDIO}`,
      }).then((commitmsg) => {
        execa('git', ['tag', `v${version}`], { stdio: `${CONFIG.STDIO}` }).then(
          (tag) => {
            execa('git', ['push', '--follow-tags'], {
              stdio: `${CONFIG.STDIO}`,
            }).then((result) => {
              done();
            });
          },
        );
      });
    });
  });
});

task('CLEAN_FOLDER', (done) => {
  del(['./runtime.zip', './www/resources']).then(() => {
    done();
  });
});

task('GET_LATEST_MOBILE_RUNTINE', (done) => {
  CONFIG.URL = execSync(
    `curl -s https://api.github.com/repos/SAP/openui5/releases/latest | grep browser_download_url | grep openui5-runtime-mobile | cut -d '"' -f 4`,
  ).toString();

  download(CONFIG.URL)
    .pipe(dest('./'))
    .pipe(
      rename(function (path) {
        path.basename = 'runtime';
        path.extname = '.zip';
      }),
    )
    .pipe(dest('./'))
    .on('end', () => {
      done();
    });
});

task('CREATE_RESOURCE_FOLDER', (done) => {
  src('./runtime.zip')
    .pipe(unzip())
    .pipe(dest('./www/'))
    .on('end', () => {
      del(['./runtime.zip', './openui5-runtime-mobile**'], done());
    });
});

task('DELETE_DEBUG_FILES', (done) => {
  del(['./www/**-dbg.js', './www/**/**-dbg.js']).then(() => {
    done();
  });
});

task('CREATE_COMPONENT_PRELOAD', () => {
  return src([
    'www/**/**.+(js|xml)',
    '!www/resources/**',
    '!www/Component-preload.js',
    '!gulpfile.js',
  ])
    .pipe(gulpif('www/**/*.js', uglify()))
    .pipe(
      ui5preload({
        base: '.',
        namespace: 'com/ws',
      }),
    )
    .pipe(dest('www'));
});

export default series(
  'CLEAN_FOLDER',
  'GET_LATEST_MOBILE_RUNTINE',
  'CREATE_RESOURCE_FOLDER',
  'CREATE_COMPONENT_PRELOAD',
);
