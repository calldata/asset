import { generateSigner } from '@metaplex-foundation/umi';
import { httpDownloader } from '@metaplex-foundation/umi-downloader-http';
import test from 'ava';
import {
  Asset,
  Discriminator,
  ExtensionType,
  Standard,
  State,
  blob,
  create,
  fetchAsset,
  initialize,
} from '../../src';
import { createUmi } from '../_setup';

test('it can create a new asset with a blob', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = (await createUmi()).use(httpDownloader());
  const asset = generateSigner(umi);
  const holder = generateSigner(umi);

  // And we initialize an asset with a blob (image) extension.
  const image = (
    await umi.downloader.download([
      'https://arweave.net/Y8MBS8tqo9XJ_Z1l9V6BIMvhknWxhzP0UxSNBk1OXSs',
    ])
  )[0];

  // And we initialize an image extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: blob(image.contentType ?? 'image/png', image.buffer),
  }).sendAndConfirm(umi);

  t.true(await umi.rpc.accountExists(asset.publicKey), 'asset exists');

  // When we create the asset.
  await create(umi, {
    asset,
    holder: holder.publicKey,
    name: 'Blob Asset',
  }).sendAndConfirm(umi);

  // Then an asset was created with the correct data.
  const assetAccount = await fetchAsset(umi, asset.publicKey);
  t.like(assetAccount, <Asset>{
    discriminator: Discriminator.Asset,
    state: State.Unlocked,
    standard: Standard.NonFungible,
    holder: holder.publicKey,
    authority: umi.identity.publicKey,
  });

  // And the blob (image) extension was added.
  const extension = assetAccount.extensions[0];
  t.true(extension.type === ExtensionType.Blob);

  // And the blob (image) has the correct data.
  if (extension.type === ExtensionType.Blob) {
    t.is(extension.contentType, image.contentType ?? 'image/png');
    t.is(extension.data.length, image.buffer.length);
    t.deepEqual(extension.data, Array.from(image.buffer));
  }
});
