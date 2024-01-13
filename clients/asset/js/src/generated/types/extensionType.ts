/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Serializer, scalarEnum } from '@metaplex-foundation/umi/serializers';

export enum ExtensionType {
  None,
  Attributes,
  Blob,
  Creators,
  Links,
}

export type ExtensionTypeArgs = ExtensionType;

export function getExtensionTypeSerializer(): Serializer<
  ExtensionTypeArgs,
  ExtensionType
> {
  return scalarEnum<ExtensionType>(ExtensionType, {
    description: 'ExtensionType',
  }) as Serializer<ExtensionTypeArgs, ExtensionType>;
}
