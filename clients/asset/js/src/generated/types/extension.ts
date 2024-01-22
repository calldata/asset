/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable } from '@metaplex-foundation/umi';
import {
  Serializer,
  bytes,
  option,
  struct,
  u32,
} from '@metaplex-foundation/umi/serializers';
import {
  ExtensionType,
  ExtensionTypeArgs,
  getExtensionTypeSerializer,
} from '.';

export type Extension = {
  extensionType: ExtensionType;
  length: number;
  data: Option<Uint8Array>;
};

export type ExtensionArgs = {
  extensionType: ExtensionTypeArgs;
  length: number;
  data: OptionOrNullable<Uint8Array>;
};

export function getExtensionSerializer(): Serializer<ExtensionArgs, Extension> {
  return struct<Extension>(
    [
      ['extensionType', getExtensionTypeSerializer()],
      ['length', u32()],
      ['data', option(bytes({ size: u32() }))],
    ],
    { description: 'Extension' }
  ) as Serializer<ExtensionArgs, Extension>;
}
