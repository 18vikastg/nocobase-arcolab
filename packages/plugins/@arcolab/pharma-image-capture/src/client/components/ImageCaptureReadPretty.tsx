/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React from 'react';
import { Image, Space, Tag, Tooltip, Typography, Empty, theme } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ScanOutlined,
  SafetyCertificateOutlined,
  CameraOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

function getImageUrl(record: any): string {
  if (!record) return '';
  if (record.url) return record.url;
  if (record.previewUrl) return record.previewUrl;
  if (record.preview) return record.preview;
  return '';
}

interface Props {
  value?: any[];
  size?: 'small' | 'default';
}

export const ImageCaptureReadPretty: React.FC<Props> = ({ value, size }) => {
  const { token } = theme.useToken();
  const captures = value || [];

  if (captures.length === 0) {
    if (size === 'small') return <Text type="secondary">—</Text>;
    return <Empty description="No captures" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  if (size === 'small') {
    return (
      <Image.PreviewGroup>
        <Space size={4}>
          {captures.map((c: any, i: number) => (
            <Image
              key={i}
              src={getImageUrl(c)}
              width={24}
              height={24}
              style={{ objectFit: 'cover', borderRadius: 2 }}
            />
          ))}
        </Space>
      </Image.PreviewGroup>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: token.paddingSM,
        background: token.colorBgContainer,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Tag icon={<SafetyCertificateOutlined />} color="blue">
          FDA 21 CFR Part 11 — {captures.length} capture(s)
        </Tag>
      </div>
      <Image.PreviewGroup>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {captures.map((c: any, i: number) => (
            <div
              key={i}
              style={{
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
                overflow: 'hidden',
                width: 200,
              }}
            >
              <Image src={getImageUrl(c)} width={200} height={150} style={{ objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '6px 8px', background: token.colorBgLayout, fontSize: 11 }}>
                <div>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {c.meta?.timestamp
                    ? new Date(c.meta.timestamp).toLocaleString()
                    : c.createdAt
                      ? new Date(c.createdAt).toLocaleString()
                      : '—'}
                </div>
                <div>
                  <UserOutlined style={{ marginRight: 4 }} />
                  {c.meta?.userName || c.title || c.filename || '—'}
                </div>
                {c.meta?.latitude != null && (
                  <div>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    {c.meta.latitude.toFixed(4)}, {c.meta.longitude?.toFixed(4)}
                  </div>
                )}
                {c.meta?.barcode && (
                  <div>
                    <ScanOutlined style={{ marginRight: 4 }} />
                    {c.meta.barcode}
                  </div>
                )}
                {c.meta?.imageHash && <div>SHA-256: {c.meta.imageHash.substring(0, 12)}…</div>}
              </div>
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
    </div>
  );
};
