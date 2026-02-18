/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { ISchema } from '@formily/react';
import { uid } from '@formily/shared';
import { CollectionFieldInterface, interfacesProperties } from '@nocobase/client';
import { NAMESPACE, tval } from '../locale';

export class ImageCaptureFieldInterface extends CollectionFieldInterface {
  name = 'imageCapture';
  type = 'object';
  group = 'media';
  order = 2;
  title = tval('Image Capture');
  description = tval('FDA 21 CFR Part 11 Compliant');
  isAssociation = true;

  default = {
    type: 'belongsToMany',
    target: 'attachments',
    uiSchema: {
      type: 'array',
      'x-component': 'ImageCaptureField',
      'x-use-component-props': 'useImageCaptureFieldProps',
      'x-component-props': {
        cameraOnly: true,
        requireBarcode: false,
        maxCaptures: 5,
        enableGeolocation: true,
      },
    },
  };

  availableTypes = ['belongsToMany'];

  schemaInitialize(schema: ISchema, { block, field }: { block: string; field: any }) {
    if (!schema['x-component-props']) {
      schema['x-component-props'] = {};
    }
    schema['x-component-props'].cameraOnly = field?.uiSchema?.['x-component-props']?.cameraOnly ?? true;
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'].size = 'small';
      schema['x-component'] = 'ImageCaptureField.ReadPretty';
    }
    schema['x-use-component-props'] = 'useImageCaptureFieldProps';
  }

  initialize(values: any) {
    if (!values.through) values.through = `t_${uid()}`;
    if (!values.foreignKey) values.foreignKey = `f_${uid()}`;
    if (!values.otherKey) values.otherKey = `f_${uid()}`;
    if (!values.sourceKey) values.sourceKey = 'id';
    if (!values.targetKey) values.targetKey = 'id';
  }

  properties = {
    ...interfacesProperties.defaultProps,
    'uiSchema.x-component-props.cameraOnly': {
      type: 'boolean',
      title: tval('Camera Only'),
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: true,
    },
    'uiSchema.x-component-props.requireBarcode': {
      type: 'boolean',
      title: tval('Require Barcode'),
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: false,
    },
    'uiSchema.x-component-props.maxCaptures': {
      type: 'number',
      title: tval('Max Captures'),
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': { min: 1, max: 20 },
      default: 5,
    },
    'uiSchema.x-component-props.enableGeolocation': {
      type: 'boolean',
      title: tval('Enable Geolocation'),
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: true,
    },
  };

  filterable = {
    children: [
      {
        name: 'id',
        value: 'id',
        title: '{{t("Exists")}}',
        label: '{{t("Exists")}}',
        operators: [
          { label: '{{t("exists")}}', value: '$exists', noValue: true },
          { label: '{{t("not exists")}}', value: '$notExists', noValue: true },
        ],
        schema: { title: '{{t("Exists")}}', type: 'string', 'x-component': 'Input' },
      },
    ],
  };
}
