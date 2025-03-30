import fs from 'fs';
import path from 'path';
import { WebClient } from '@slack/web-api';
import { Step } from '@mastra/core';
import { z } from 'zod';

// SlackのBotトークン
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
// アップロード先のチャンネルID (例: C12345678)
const SLACK_CHANNEL_ID = 'CELMD3VU7';

const client = new WebClient(SLACK_BOT_TOKEN);


export const slackUploadStep = new Step({
  id: "slackUploadStep",
  inputSchema: z.object({
    filepath: z.string(),
  }),
  execute: async ({ context }) => {
    const filePath = context?.getStepResult<{
      filepath: string;
    }>(
      "speachStep",
    );
    if (!filePath) {
      throw new Error("No file path found");
    }

    await uploadAudioToSlack(filePath.filepath);
  },
});


async function uploadAudioToSlack(filePath: string) {
  try {
    // ストリームを作成
    const fileStream = fs.createReadStream(filePath);

    // Slackにファイルをアップロード
    const result = await client.files.uploadV2({
      channels: SLACK_CHANNEL_ID,
      file: fileStream,
      filename: path.basename(filePath),  // Slack上で表示されるファイル名
      initial_comment: '音声ファイルをアップロードしました！'
    });

    console.log('File uploaded successfully:', result);
  } catch (err) {
    console.error('Failed to upload file to Slack:', err);
  }
}
