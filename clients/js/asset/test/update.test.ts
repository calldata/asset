import { generateSigner } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  ASSET_PROGRAM_ID,
  Asset,
  DelegateRole,
  ExtensionType,
  attributes,
  blob,
  create,
  fetchAsset,
  initialize,
  links,
  manager,
  update,
  updateWithBuffer,
} from '../src';
import { createUmi } from './_setup';

test('it can update the name of an asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And a new asset.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    payer: umi.identity,
    name: 'Digital Asset v1',
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    name: 'Digital Asset v1',
  });

  // When we update the name of the asset.
  await update(umi, {
    asset: asset.publicKey,
    name: 'Digital Asset v2',
  }).sendAndConfirm(umi);

  // Then the asset has the new name.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    name: 'Digital Asset v2',
  });
});

test('it can update an asset to be immutable', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);

  // And a new asset.
  const asset = generateSigner(umi);
  await create(umi, {
    asset,
    owner: owner.publicKey,
    payer: umi.identity,
    name: 'Digital Asset v1',
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    mutable: true,
  });

  // When we update the mutability of the asset.
  await update(umi, {
    asset: asset.publicKey,
    mutable: false,
  }).sendAndConfirm(umi);

  // Then the asset is immutable.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    mutable: false,
  });
});

test('it cannot update an immutable asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);

  // And a new asset.
  const asset = generateSigner(umi);
  await create(umi, {
    asset,
    owner: owner.publicKey,
    payer: umi.identity,
    name: 'Digital Asset v1',
    mutable: false,
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    mutable: false,
  });

  // When we try to update an immutable asset.
  const promise = update(umi, {
    asset: asset.publicKey,
    name: 'Digital Asset v2',
  }).sendAndConfirm(umi);

  // Then we get an error.
  await t.throwsAsync(promise, {
    message: /Immutable asset/,
  });
});

test('it can update the extension of an asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we initialize an extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: attributes([
      { name: 'Type', value: 'Dark' },
      { name: 'Clothes', value: 'Purple Shirt' },
      { name: 'Ears', value: 'None' },
    ]),
  }).sendAndConfirm(umi);

  // And we create a new asset.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
    ],
  });

  // When we update the extension of the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: attributes([{ name: 'Clothes', value: 'Purple Shirt' }]),
  }).sendAndConfirm(umi);

  // Then the extension is updated.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [{ name: 'Clothes', value: 'Purple Shirt' }],
      },
    ],
  });
});

test('it can update the extension of an asset with multiple extensions', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we initialize an attributes extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: attributes([
      { name: 'Type', value: 'Dark' },
      { name: 'Clothes', value: 'Purple Shirt' },
      { name: 'Ears', value: 'None' },
    ]),
  }).sendAndConfirm(umi);

  // And we initialize a links extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: links([
      {
        name: 'metadata',
        uri: 'https://arweave.net/ebBV1qEYt65AKmM2J5wH_Vg-gjBa9YcwSYWFVt0rw9w',
      },
    ]),
  }).sendAndConfirm(umi);

  // And we create a new asset.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
      {
        type: ExtensionType.Links,
        values: [
          {
            name: 'metadata',
            uri: 'https://arweave.net/ebBV1qEYt65AKmM2J5wH_Vg-gjBa9YcwSYWFVt0rw9w',
          },
        ],
      },
    ],
  });

  // When we update the extension of the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: attributes([{ name: 'Clothes', value: 'Purple Shirt' }]),
  }).sendAndConfirm(umi);

  // Then the extension is updated.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [{ name: 'Clothes', value: 'Purple Shirt' }],
      },
      {
        type: ExtensionType.Links,
        values: [
          {
            name: 'metadata',
            uri: 'https://arweave.net/ebBV1qEYt65AKmM2J5wH_Vg-gjBa9YcwSYWFVt0rw9w',
          },
        ],
      },
    ],
  });
});

test('it can extend the length of an extension', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we initialize an extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: attributes([{ name: 'Type', value: 'Dark' }]),
  }).sendAndConfirm(umi);

  // And we create a new asset.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [{ name: 'Type', value: 'Dark' }],
      },
    ],
  });

  // When we update the extension of the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: attributes([
      { name: 'Type', value: 'Dark' },
      { name: 'Clothes', value: 'Purple Shirt' },
      { name: 'Ears', value: 'None' },
    ]),
  }).sendAndConfirm(umi);

  // Then the extension is updated.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
    ],
  });
});

test('it can update an asset with a buffer', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we initialize an asset with a blob (image) extension.
  let response = await fetch(
    'https://arweave.net/Y8MBS8tqo9XJ_Z1l9V6BIMvhknWxhzP0UxSNBk1OXSs'
  );
  let image = new Uint8Array(await response.arrayBuffer());
  let contentType = response.headers.get('content-type') ?? 'image/png';

  // And we initialize an image extension.
  await initialize(umi, {
    asset,
    payer: umi.identity,
    extension: blob(contentType, image),
  }).sendAndConfirm(umi);

  t.true(await umi.rpc.accountExists(asset.publicKey), 'asset exists');

  // And we create the asset with a blob (image) extension.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Blob Asset',
  }).sendAndConfirm(umi);

  let assetAccount = await fetchAsset(umi, asset.publicKey);
  let extension = assetAccount.extensions[0];
  t.true(extension.type === ExtensionType.Blob);

  if (extension.type === ExtensionType.Blob) {
    t.is(extension.contentType, contentType);
    t.is(extension.data.length, image.length);
    t.deepEqual(extension.data, Array.from(image));
  }

  // When we update the asset with a buffer.
  response = await fetch(
    'https://arweave.net/jq15kbD89BMQyc1YIH7PD5RWfFqnxRhVzjt0UZNgDu8'
  );
  image = new Uint8Array(await response.arrayBuffer());
  contentType = response.headers.get('content-type') ?? 'image/png';

  await updateWithBuffer(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: blob(contentType, image),
  }).sendAndConfirm(umi);

  // Then the asset was updated correctly.
  assetAccount = await fetchAsset(umi, asset.publicKey);
  [extension] = assetAccount.extensions;
  t.true(extension.type === ExtensionType.Blob);

  if (extension.type === ExtensionType.Blob) {
    t.is(extension.contentType, contentType);
    t.is(extension.data.length, image.length);
    t.deepEqual(extension.data, Array.from(image));
  }
});

test('it can update an asset to add an extension', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we create a new asset without extensions.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
    payer: umi.identity,
  }).sendAndConfirm(umi);

  t.assert((await fetchAsset(umi, asset.publicKey)).extensions.length === 0);

  // When we add a new extension to the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: attributes([
      { name: 'Type', value: 'Dark' },
      { name: 'Clothes', value: 'Purple Shirt' },
      { name: 'Ears', value: 'None' },
    ]),
  }).sendAndConfirm(umi);

  // Then the asset has an extension.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
    ],
  });
});

test('it can update an asset to add multiple extensions', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we create a new asset without extensions.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
    payer: umi.identity,
  }).sendAndConfirm(umi);

  t.assert((await fetchAsset(umi, asset.publicKey)).extensions.length === 0);

  // And we add a new extension to the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: attributes([
      { name: 'Type', value: 'Dark' },
      { name: 'Clothes', value: 'Purple Shirt' },
      { name: 'Ears', value: 'None' },
    ]),
  }).sendAndConfirm(umi);

  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
    ],
  });

  // When we add a second extension to the asset.
  await update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: links([
      {
        name: 'metadata',
        uri: 'https://arweave.net/ebBV1qEYt65AKmM2J5wH_Vg-gjBa9YcwSYWFVt0rw9w',
      },
    ]),
  }).sendAndConfirm(umi);

  // Then the asset has two extensions.
  t.like(await fetchAsset(umi, asset.publicKey), <Asset>{
    extensions: [
      {
        type: ExtensionType.Attributes,
        values: [
          { name: 'Type', value: 'Dark' },
          { name: 'Clothes', value: 'Purple Shirt' },
          { name: 'Ears', value: 'None' },
        ],
      },
      {
        type: ExtensionType.Links,
        values: [
          {
            name: 'metadata',
            uri: 'https://arweave.net/ebBV1qEYt65AKmM2J5wH_Vg-gjBa9YcwSYWFVt0rw9w',
          },
        ],
      },
    ],
  });
});

test('it cannot update an asset to add a manager extension', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we create a new asset without extensions.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
    payer: umi.identity,
  }).sendAndConfirm(umi);

  t.assert((await fetchAsset(umi, asset.publicKey)).extensions.length === 0);

  // When we add a new extension to the asset.
  const promise = update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: manager(umi.identity.publicKey, DelegateRole.Transfer),
  }).sendAndConfirm(umi);

  // Then we expect an error.
  await t.throwsAsync(promise, {
    message: /Extension data invalid/,
  });
});

test('it cannot update an asset to add a proxy extension', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const asset = generateSigner(umi);
  const owner = generateSigner(umi);

  // And we create a new asset without extensions.
  await create(umi, {
    asset,
    owner: owner.publicKey,
    name: 'Digital Asset',
    payer: umi.identity,
  }).sendAndConfirm(umi);

  t.assert((await fetchAsset(umi, asset.publicKey)).extensions.length === 0);

  // When we add a new extension to the asset.
  const promise = update(umi, {
    asset: asset.publicKey,
    payer: umi.identity,
    extension: {
      type: ExtensionType.Proxy,
      program: ASSET_PROGRAM_ID,
      bump: 255,
      seeds: Array.from({ length: 32 }, () => 0),
      authority: null,
    },
  }).sendAndConfirm(umi);

  // Then we expect an error.
  await t.throwsAsync(promise, {
    message: /Extension data invalid/,
  });
});
