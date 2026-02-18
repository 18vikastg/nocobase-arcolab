/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React from 'react';
import { Card, Typography, Descriptions, Tag } from 'antd';
import { SafetyCertificateOutlined, CameraOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const ImageCaptureSettings: React.FC = () => {
  return (
    <Card>
      <Title level={4}>
        <CameraOutlined /> Image Capture — Plugin Settings
      </Title>
      <Paragraph>
        Using the Image Capture plugin, you can configure fields to capture photos directly from the device camera. This
        is ideal for compliance-sensitive environments like pharmaceuticals, where you need to ensure data integrity and
        auditability of captured images.
      </Paragraph>
      <Descriptions title="Compliance Information" bordered column={1} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Standard">
          <Tag icon={<SafetyCertificateOutlined />} color="blue">
            Image-capture-v1.0
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Image Immutability">
          Captured images cannot be edited or replaced after acceptance.
        </Descriptions.Item>
        <Descriptions.Item label="Audit Trail">
          Every capture creates an immutable record with timestamp, user, GPS, device, and SHA-256 hash.
        </Descriptions.Item>
        <Descriptions.Item label="Electronic Signature">
          Each capture auto-signed with authenticated user identity and timestamp.
        </Descriptions.Item>
        <Descriptions.Item label="Data Integrity">
          SHA-256 hash computed client-side before upload, stored in audit trail.
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="Field Options" bordered column={1} size="small">
        <Descriptions.Item label="Camera Only">Default ON. Prevents gallery/file-picker upload.</Descriptions.Item>
        <Descriptions.Item label="Require Barcode">
          QR/barcode must be detected before accept. Needs jsqr package.
        </Descriptions.Item>
        <Descriptions.Item label="Max Captures">Limit per field instance (default: 5, max: 20).</Descriptions.Item>
        <Descriptions.Item label="Enable Geolocation">Embeds GPS coordinates in capture metadata.</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
