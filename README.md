# NodeJS Upload Asset

## [GitHub Action](https://github.com/features/actions) written in [TypeScript](http://www.typescriptlang.org/)

### Upload asset to release - [GitHub Action](https://github.com/features/actions).

This action uploads an asset to a release, so your workflow can access it.

[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Issues][issues-image]][issues-url]

[![Codacy Badge][codacy-imge]][codacy-url][![Code maintainability][code-maintainability-image]][code-maintainability-url] [![Code issues][code-issues-image]][code-issues-url] [![Code Technical Debt][code-tech-debt-image]][code-tech-debt-url]

[![Main Language][language-image]][code-metric-url] [![Languages][languages-image]][code-metric-url] [![Code Size][code-size-image]][code-metric-url] [![Repo-Size][repo-size-image]][code-metric-url]

|                                                                  |                                                                            | [![Release][release-image]][release-url]                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [![Master Build][master-build-image]][master-url]                | [![Master Coverage][master-coveralls-image]][master-coveralls-url]         | [![Master Version][master-version-image]][master-version-url]                |
| [![Development Build][development-build-image]][development-url] | [![Test Coverage][development-coveralls-image]][development-coveralls-url] | [![Development Version][development-version-image]][development-version-url] |

## Usage

```YML
    ...
    - name: nodejs project information
      id: projectinfo
      uses: gregoranders/nodejs-project-info@v0.0.10
    - name: create release
      id: createrelease
      uses: gregoranders/nodejs-create-release@v0.0.10
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag: v${{ steps.projectinfo.outputs.version }}
        name: ${{ steps.projectinfo.outputs.name }} - ${{ steps.projectinfo.outputs.version }} Release
        target: ${{ github.ref }}
    - name: upload asset
      id: uploadasset
      uses: gregoranders/nodejs-upload-asset@v0.0.10
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        id: ${{ steps.createrelease.outputs.id }}
        path: package.json
        name: '${{ steps.projectinfo.outputs.name }} - ${{ steps.projectinfo.outputs.version }}'
    ...
```

#### Inputs/Outputs

```YML
inputs:
  id:
    description: 'Release Id'
    required: true
  path:
    description: 'Release Asset Path'
    required: true
  label:
    description: 'Release Asset Label'
    required: false
    default: '${name}'
  name:
    description: 'Release Asset File Name'
    required: false
    default: '${path}'
outputs:
  id:
    description: 'Release Id'
  url:
    description: 'Release Url'
```

[release-url]: https://github.com/gregoranders/nodejs-upload-asset/releases
[master-url]: https://github.com/gregoranders/nodejs-upload-asset/tree/master
[development-url]: https://github.com/gregoranders/nodejs-upload-asset/tree/development
[repository-url]: https://github.com/gregoranders/nodejs-upload-asset
[code-metric-url]: https://github.com/gregoranders/nodejs-upload-asset/search?l=TypeScript
[travis-url]: https://travis-ci.org/gregoranders/nodejs-upload-asset
[travis-image]: https://travis-ci.org/gregoranders/nodejs-upload-asset.svg?branch=master
[daviddm-url]: https://david-dm.org/gregoranders/nodejs-upload-asset
[daviddm-image]: https://david-dm.org/gregoranders/nodejs-upload-asset.svg?branch=master
[license-url]: https://github.com/gregoranders/nodejs-upload-asset/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/gregoranders/nodejs-upload-asset.svg
[master-version-url]: https://github.com/gregoranders/nodejs-upload-asset/blob/master/package.json
[master-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-upload-asset/master
[development-version-url]: https://github.com/gregoranders/nodejs-upload-asset/blob/development/package.json
[development-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-upload-asset/development
[issues-url]: https://github.com/gregoranders/nodejs-upload-asset/issues
[issues-image]: https://img.shields.io/github/issues-raw/gregoranders/nodejs-upload-asset.svg
[release-image]: https://img.shields.io/github/release/gregoranders/nodejs-upload-asset
[release-build-image]: https://github.com/gregoranders/nodejs-upload-asset/workflows/Release%20CI/badge.svg
[master-build-image]: https://github.com/gregoranders/nodejs-upload-asset/workflows/Master%20CI/badge.svg
[development-build-image]: https://github.com/gregoranders/nodejs-upload-asset/workflows/Development%20CI/badge.svg
[master-coveralls-url]: https://coveralls.io/github/gregoranders/nodejs-upload-asset?branch=master
[master-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/nodejs-upload-asset/master
[development-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/nodejs-upload-asset/development
[development-coveralls-url]: https://coveralls.io/github/gregoranders/nodejs-upload-asset?branch=development
[code-maintainability-url]: https://codeclimate.com/github/gregoranders/nodejs-upload-asset/maintainability
[code-maintainability-image]: https://img.shields.io/codeclimate/maintainability/gregoranders/nodejs-upload-asset
[code-issues-url]: https://codeclimate.com/github/gregoranders/nodejs-upload-asset/maintainability
[code-issues-image]: https://img.shields.io/codeclimate/issues/gregoranders/nodejs-upload-asset
[code-tech-debt-url]: https://codeclimate.com/github/gregoranders/nodejs-upload-asset/maintainability
[code-tech-debt-image]: https://img.shields.io/codeclimate/tech-debt/gregoranders/nodejs-upload-asset
[language-image]: https://img.shields.io/github/languages/top/gregoranders/nodejs-upload-asset
[languages-image]: https://img.shields.io/github/languages/count/gregoranders/nodejs-upload-asset
[code-size-image]: https://img.shields.io/github/languages/code-size/gregoranders/nodejs-upload-asset
[repo-size-image]: https://img.shields.io/github/repo-size/gregoranders/nodejs-upload-asset
[codacy-imge]: https://app.codacy.com/project/badge/Grade/ade2dc1495e942019cda4408f84ef8db
[codacy-url]: https://www.codacy.com/manual/gregoranders/nodejs-upload-asset
