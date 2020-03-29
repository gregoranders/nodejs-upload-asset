import * as core from "@actions/core";
import { GitHub } from "@actions/github";

import * as fs from "fs";
import { getType } from "mime";
import { basename, resolve } from "path";

import Octokit from "@actions/github/node_modules/@octokit/rest";

type ReposUploadReleaseAssetParams = Octokit.Octokit.ReposUploadReleaseAssetParams;

const uploadAsset = async (client: GitHub, params: ReposUploadReleaseAssetParams) => {
  core.startGroup(`Uploading asset ${params.label} to release ${params.url}`);
  const response = await client.repos.uploadReleaseAsset(params);
  core.info(`Release asset ${response.data.value.name} created [id: ${response.data.value.id}]`);
  core.endGroup();
  return response.data.value;
};

export const run = async () => {
  const path = core.getInput("path", { required: true });

  const name = core.getInput("name", { required: false }) || basename(path);
  const label = core.getInput("label", { required: false });
  const url = core.getInput("url", { required: true });
  const mime = core.getInput("mime", { required: false });

  try {
    if (!process.env.GITHUB_TOKEN) {
      throw Error("Missing GITHUB_TOKEN");
    }

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const fullPathChecked: fs.PathLike = resolve(fs.realpathSync(path));

    const headers = {
      "content-length": fs.statSync(fullPathChecked).size,
      "content-type": mime || getType(fullPathChecked.toString()) || "application/zip",
    };

    const data = fs.readFileSync(fullPathChecked);

    const asset = await uploadAsset(github, {
      data,
      headers,
      label,
      name,
      url,
    });

    core.setOutput("id", asset.id.toString());
    core.setOutput("url", asset.browser_download_url);
  } catch (error) {
    core.setFailed(error);
  }
};
