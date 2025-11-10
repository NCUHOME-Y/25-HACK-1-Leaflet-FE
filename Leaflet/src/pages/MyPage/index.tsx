import { useState, useEffect, useMemo } from 'react';
import { Button, Toast, Image, Space, TabBar, CenterPopup, Input } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultAvatar from '../../assets/images/default-avatar.png';
import treeSeed from '../../assets/images/tree-seed.png';
import treeWithLeaves from '../../assets/images/tree-with-leaves.png';
import airplaneFly from '../../assets/images/airplane-fly.png';
import airplanePick from '../../assets/images/airplane-pick.png';
import iconArchive from '../../assets/images/icon-archive.png';
import iconAbout from '../../assets/images/icon-about.png';

export default function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = useMemo(() => {
    // 让 TabBar 高亮当前路由
    if (location.pathname.startsWith("/tree")) return "/tree";
    if (location.pathname.startsWith("/record")) return "/record";
    if (location.pathname.startsWith("/encouragement"))
      return "/encouragement";
    if (location.pathname.startsWith("/my")) return "/my";
    return "/my";
  }, [location.pathname]);

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

  // 编辑弹窗状态
  const [editVisible, setEditVisible] = useState(false);
  const [formNickname, setFormNickname] = useState('');
  const [formAvatar, setFormAvatar] = useState<string>('');

  const avatarOptions = [
    defaultAvatar,
    treeSeed,
    treeWithLeaves,
    airplaneFly,
    airplanePick,
    iconArchive,
  ];

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

  // 打开编辑弹窗
  const handleOpenEdit = () => {
    setFormNickname(user.nickname);
    setFormAvatar(user.avatar);
    setEditVisible(true);
  };

  // 保存编辑
  const handleSaveProfile = async () => {
    const nickname = formNickname.trim();
    if (!nickname) {
      Toast.show('请输入昵称');
      return;
    }

    // 先本地更新，确保交互流畅；同时可并发请求后端
    setUser(prev => ({ ...prev, nickname, avatar: formAvatar || prev.avatar }));
    setEditVisible(false);
    Toast.show('保存中…');

    // 可在此调用后端接口（若后端不可用则静默失败）
    try {
      const { updateNickname, updateAvatar } = await import('../../services/user.service');
      await Promise.allSettled([
        updateNickname(nickname),
        updateAvatar(formAvatar || user.avatar),
      ]);
      Toast.show('资料已更新');
    } catch (e) {
      // 静默处理，保留本地状态
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #edfff5 0%, #f6fffb 100%)',
      paddingBottom: '76px'
    }}>
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
              onClick={handleOpenEdit}
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

      {/* 编辑资料弹窗 */}
      <CenterPopup
        visible={editVisible}
        onMaskClick={() => setEditVisible(false)}
        onClose={() => setEditVisible(false)}
        bodyStyle={{ width: 480, maxWidth: '86vw' }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>编辑资料</div>
          <div style={{ marginBottom: 10, fontSize: 12, color: '#666' }}>昵称</div>
          <Input
            value={formNickname}
            onChange={val => setFormNickname(val)}
            placeholder="请输入昵称"
            maxLength={20}
            style={{ marginBottom: 12 }}
          />

          <div style={{ marginBottom: 10, fontSize: 12, color: '#666' }}>头像</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {avatarOptions.map((src) => {
              const active = formAvatar === src;
              return (
                <button
                  key={src}
                  onClick={() => setFormAvatar(src)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    border: active ? '2px solid #00a878' : '1px solid #e6e6e6',
                    padding: 0,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Image src={src} style={{ width: 28, height: 28 }} fit="contain" />
                </button>
              );
            })}
          </div>

          <Button color="primary" block onClick={handleSaveProfile}>保存</Button>
        </div>
      </CenterPopup>

      {/* 底部导航 TabBar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #eee",
        }}
      >
        <TabBar
          activeKey={activeKey}
          onChange={(key) => {
            navigate(key);
          }}
        >
          <TabBar.Item
            key="/tree"
            icon={<span style={{ fontSize: 20 }}>🌳</span>}
            title="心情树"
          />
          <TabBar.Item
            key="/record"
            icon={<span style={{ fontSize: 20 }}>📝</span>}
            title="心情记录"
          />
          <TabBar.Item
            key="/encouragement"
            icon={<span style={{ fontSize: 20 }}>💬</span>}
            title="每日鼓励"
          />
          <TabBar.Item
            key="/my"
            icon={<span style={{ fontSize: 20 }}>👤</span>}
            title="我的"
          />
        </TabBar>
      </div>
    </div>
  );
}