/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { useField, useFieldSchema } from '@formily/react';
import { useAPIClient, useCollection, useCurrentUserContext } from '@nocobase/client';

export function useImageCaptureFieldProps() {
  const field = useField<any>();
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const apiClient = useAPIClient();
  const currentUser = useCurrentUserContext();

  return {
    action: 'attachments:create',
    apiClient,
    currentUser: currentUser?.data?.data,
  };
}
