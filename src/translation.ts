import * as path from "path";

import {
  DescriptorProto,
  FieldDescriptorProto,
  FileDescriptorProto
} from "google-protobuf/google/protobuf/descriptor_pb";

const INVALID_FIELD_NAMES = [
  "serializeBinary",
  "toObject",
  "extensions",
  "extensionsBinary",
  "serializeBinaryToWriter",
  "deserializeBinary",
  "deserializeBinaryFromReader",
];

/**
 * Translate a file into a set of protobuf classes.
 * @param file
 */
export const translateFile = (file: FileDescriptorProto): string => {
  const messages = file.getMessageTypeList();
  return (
    `${generateImportString(file)}\n\n` +
    messages.map(translateDescriptor).join("\n\n")
  );
};

/**
 * Generate an import string for all of the messages in a file.
 *
 * This will generate a string of the form
 * `import {ExampleMessage as PBExampleMessage} from "./example_pb";`.
 */
const generateImportString = (file: FileDescriptorProto): string => {
  const classNames = file.getMessageTypeList().map(messageType => {
    const messageName = messageType.getName();
    return `${messageName} as PB${messageName}`;
  }).join(", ");
  const fileName = path.basename(file.getName().replace(".proto", "_pb"));
  return `import {${classNames}} from "./${fileName}";`
};

/**
 * Translate a message (descriptor) into an ES2015 class with getters and
 * setters.
 */
export const translateDescriptor = (message: DescriptorProto): string => {
  const messageName = message.getName();
  const fields = message.getFieldList();

  return (
    `export class ${messageName} extends PB${messageName} {\n` +
    fields.map((field) => translateField(field, messageName)).join("\n") +
    `}\n\n`
  );
};

/**
 * Translate a field into a getter and setter.
 * @param field - A description of the field itself.
 * @param messageName - The name of the message (so that we can access type data
 *    from the `getXXX` and `setXXX` methods of the class).
 */
export const translateField = (field: FieldDescriptorProto, messageName: string): string => {
  const fieldName = field.getJsonName();
  const methodName = fieldName.charAt(0).toUpperCase() + fieldName.substr(1)
  if (INVALID_FIELD_NAMES.indexOf(fieldName) !== -1) {
    throw new Error(`Invalid field name: ${fieldName}`);
  }
  return (
    `  get ${fieldName}() {\n` +
    `    return this.get${methodName}();\n` +
    `  }\n` +
    `  set ${fieldName}(value: Parameters<PB${messageName}["set${methodName}"]>[0]) {\n` +
    `    this.set${methodName}(value);\n` +
    `  }\n`
  );
};
