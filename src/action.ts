import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types';

import * as fs from 'fs';
import { getType } from 'mime';
import { basename, resolve } from 'path';

type GitHub = ReturnType<typeof getOctokit>;
type ReposUploadReleaseAssetParams = RestEndpointMethodTypes['repos']['uploadReleaseAsset']['parameters'];

const uploadAsset = async (client: GitHub, parameters: ReposUploadReleaseAssetParams) => {
  core.startGroup(`Uploading asset ${parameters.name} to release ${parameters.url}`);
  const response = await client.repos.uploadReleaseAsset(parameters);
  core.info(`Release asset ${response.data.name} created [id: ${response.data.id}]`);
  core.endGroup();
  return response.data;
};

const prepareHeaders = (fullPathChecked: string, mime: string) => {
  return {
    'content-length': fs.statSync(fullPathChecked).size,
    'content-type': mime || getType(fullPathChecked.toString()) || 'application/zip',
  };
};

const prepareParameters = (
  data: string,
  headers: { 'content-length': number; 'content-type': string },
  label: string,
  name: string,
  release_id: string,
  owner: string,
  repo: string,
) => {
  return {
    data,
    headers,
    label,
    name,
    release_id: Number.parseInt(release_id),
    owner,
    repo,
  };
};

export const run = async (): Promise<void> => {
  const path = core.getInput('path', { required: true });

  const name = core.getInput('name', { required: false }) || basename(path);
  const label = core.getInput('label', { required: false });
  const id = core.getInput('id', { required: true });
  const mime = core.getInput('mime', { required: false });

  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('Missing GITHUB_TOKEN');
    }

    const github = getOctokit(process.env.GITHUB_TOKEN);
    const fullPathChecked: fs.PathLike = resolve(fs.realpathSync(path));
    const headers = prepareHeaders(fullPathChecked, mime);
    const data = fs.readFileSync(fullPathChecked).toString('binary');

    const asset = await uploadAsset(
      github,
      prepareParameters(data, headers, label, name, id, context.repo.owner, context.repo.repo),
    );

    core.setOutput('id', asset.id.toString());
    core.setOutput('url', asset.browser_download_url);
  } catch (error) {
    core.setFailed(error);
  }
};
