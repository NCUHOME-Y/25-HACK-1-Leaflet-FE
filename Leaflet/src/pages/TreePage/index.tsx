// src/pages/TreePage/index.tsx
import { useState, useEffect } from 'react';
import { Button, Toast, Image, Space } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import treeImg from '../../assets/images/tree-seed.png'; // 默认树苗图
import { getDailyLimit } from '../../services/airplane.service';

export default function TreePage() {
  const navigate = useNavigate();
  const [dailyLimit, setDailyLimit] = useState({ used: 0, limit: 3 });

  // 获取今日捞取次数
  useEffect(() => {
    getDailyLimit().then(res => {
      setDailyLimit(res.data);
    }).catch(() => {
      // Mock 数据兜底
      setDailyLimit({ used: 0, limit: 3 });
    });
  }, []);

  // “写纸折纸”按钮点击
  const handleWrite = () => {
    navigate('/airplane/write');
  };

  // “摘纸飞机”按钮点击
  const handlePick = () => {
    if (dailyLimit.used >= dailyLimit.limit) {
      Toast.show('今日纸飞机已捞完，明天再来吧～');
      return;
    }
    navigate('/airplane/pick');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>我的心情树</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>记录成长，匿名分享</p>

      {/* 心情树图 */}
      <Image
        src={treeImg}
        style={{ width: '80%', maxWidth: '300px', margin: '20px auto' }}
        fit="contain"
      />

      {/* 等级 & 记录天数 */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{ backgroundColor: '#00a878', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
          等级 1
        </span>
      </div>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
        已记录 0 天
      </div>
      <div style={{ color: '#00a878', fontSize: '14px', marginTop: '8px' }}>
        开始第一次记录，解锁你的香樟树苗！
      </div>

      {/* 两个核心按钮 */}
      <Space direction="vertical" block style={{ marginTop: '30px' }}>
        <Button
          color="primary"
          size="large"
          onClick={handleWrite}
          style={{ backgroundColor: '#00a878', borderColor: '#00a878' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>✈️</span>
            写纸折纸
          </div>
        </Button>

        <Button
          color="primary"
          size="large"
          onClick={handlePick}
          style={{
            backgroundColor: '#00bfa5',
            borderColor: '#00bfa5',
            opacity: dailyLimit.used >= dailyLimit.limit ? 0.6 : 1,
          }}
          disabled={dailyLimit.used >= dailyLimit.limit}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>✉️</span>
            摘纸飞机<br />
            <span style={{ fontSize: '12px' }}>
              {dailyLimit.used >= dailyLimit.limit ? '今日已用完' : `今日剩余 ${dailyLimit.limit - dailyLimit.used} 次`}
            </span>
          </div>
        </Button>
      </Space>
    </div>
  );
}