// src/pages/MyPage/index.tsx
import { useState, useEffect } from 'react';
import { Button, Toast, Image, Space } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/images/default-avatar.png';
import iconArchive from '../../assets/images/icon-archive.png';
import iconAbout from '../../assets/images/icon-about.png';

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nickname: 'NCU心情小伙伴',
    avatar: defaultAvatar,
    school: '南昌大学',
    stats: {
      totalRecords: 0,
      consecutiveDays: 0,
      treeLevel: 1
    }
  });

  // 获取用户信息（含统计）
  useEffect(() => {
    // 【P0 阶段】先用 Mock 数据，确保页面可跑
    const mockUser = {
      nickname: 'NCU小伙伴',
      avatar: defaultAvatar,
      school: '南昌大学',
      stats: {
        totalRecords: 3,
        consecutiveDays: 2,
        treeLevel: 2
      }
    };
    setUser(mockUser);

    // 【后期替换为真实请求】
    // getUserProfile().then(res => setUser(res.data)).catch(...);
  }, []);

  // 编辑昵称
  const handleEditNickname = () => {
    const newNickname = prompt('请输入新昵称', user.nickname);
    if (!newNickname?.trim()) return;

    // 【后期替换为真实更新】
    setUser(prev => ({ ...prev, nickname: newNickname.trim() }));
    Toast.show('昵称修改成功！');
    
    // updateNickname(newNickname).then(...).catch(...);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>我的</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>个人中心与设置</p>

      {/* 个人信息卡片 */}
      <div
        style={{
          border: '1px solid #d8f3dc',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px 0',
          backgroundColor: '#f8fff7'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={user.avatar}
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '12px' }}
              fit="cover"
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#00a878' }}>
                {user.nickname}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{user.school}</div>
            </div>
          </div>
          <Button
            size="small"
            onClick={handleEditNickname}
            style={{ padding: '4px 8px' }}
          >
            <span style={{ fontSize: '16px' }}>✏️</span>
          </Button>
        </div>

        {/* 数据统计卡片 —— 由后端提供，前端仅渲染 */}
        <Space wrap style={{ marginTop: '20px' }}>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              width: '50px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00a878' }}>
              {user.stats.totalRecords}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>累计记录</div>
          </div>
          
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              width: '50px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00a878' }}>
              {user.stats.consecutiveDays}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>连续记录</div>
          </div>
          
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              width: '50px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00a878' }}>
              Lv.{user.stats.treeLevel}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>心情树</div>
          </div>
        </Space>
      </div>

      {/* 精简功能入口：仅保留「个人心情档案」和「关于我们」 */}
      <div style={{ textAlign: 'left' }}>
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}
          onClick={() => navigate('/record')}
        >
          <Space align="center">
            <Image src={iconArchive} style={{ width: '24px', height: '24px' }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>个人心情档案</div>
              <div style={{ fontSize: '12px', color: '#666' }}>查看所有记录</div>
            </div>
          </Space>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}
          onClick={() => navigate('/about')}
        >
          <Space align="center">
            <Image src={iconAbout} style={{ width: '24px', height: '24px' }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>关于我们</div>
              <div style={{ fontSize: '12px', color: '#666' }}>版本信息与反馈</div>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
}