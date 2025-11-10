import { useState, useMemo } from 'react';
import { Button, Toast, Space, Tag, TabBar } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getTodayEncouragement } from '../../services/encouragement.service'; // 待实现

export default function EncouragementPage() {
    const [todayEncouragement, setTodayEncouragement] = useState<string | null>(null);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const activeKey = useMemo(() => {
        if (location.pathname.startsWith('/tree')) return '/tree';
        if (location.pathname.startsWith('/record')) return '/record';
        if (location.pathname.startsWith('/encouragement')) return '/encouragement';
        if (location.pathname.startsWith('/my')) return '/my';
        return '/encouragement';
    }, [location.pathname]);

    const handleGetEncouragement = async () => {
        setIsLoading(true);
        try {
            // const res = await getTodayEncouragement();
            // 临时 mock 数据
            const mockEncouragement = '每一次努力都值得被看见，加油！💪';
            setTodayEncouragement(mockEncouragement);
            setIsFetched(true);
            Toast.show({
                content: '获取成功！',
                duration: 1500
            });
        } catch (error) {
            Toast.show('获取失败，请重试～');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', paddingBottom: 90 }}>
            <h2>每日鼓励</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                温暖的话语，陪你前行 🌟
            </p>

            {/* 鼓励语卡片 */}
            <div
                style={{
                    border: '1px solid #d8f3dc',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    margin: '0 auto 32px',
                    maxWidth: '400px',
                    backgroundColor: '#f8fff7',
                    boxShadow: '0 2px 8px rgba(0,168,120,0.1)'
                }}
            >
                <Space align="center" direction="vertical" style={{ width: '100%' }}>
                    <div style={{ width: 48, height: 48, lineHeight: '48px', fontSize: 32 }}>
                        🌟
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#00a878' }}>
                            今日鼓励语
                        </div>
                        {isFetched ? (
                            <div
                                style={{
                                    marginTop: '12px',
                                    fontSize: '18px',
                                    lineHeight: 1.6,
                                    color: '#333'
                                }}
                            >
                                {todayEncouragement}
                            </div>
                        ) : (
                            <Tag color="success" style={{ marginTop: '12px' }}>
                                待获取
                            </Tag>
                        )}
                    </div>
                </Space>
            </div>

            {/* 获取按钮 */}
            <Button
                color="primary"
                size="large"
                onClick={handleGetEncouragement}
                loading={isLoading}
                disabled={isFetched}
                style={{
                    backgroundColor: isFetched ? '#ccc' : '#00a878',
                    borderColor: isFetched ? '#ccc' : '#00a878',
                    width: '90%',
                    maxWidth: '320px',
                    margin: '0 auto'
                }}
            >
                {isFetched ? '今日已获取' : '✨ 获取今日鼓励'}
            </Button>

            {/* 温馨提示 */}
            <div style={{ marginTop: '40px', fontSize: '13px', color: '#999', marginBottom: 32 }}>
                温暖不重复 ❤️
            </div>

            {/* 底部导航 */}
            <div
                style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#fff',
                    borderTop: '1px solid #eee'
                }}
            >
                <TabBar
                    activeKey={activeKey}
                    onChange={(key) => {
                        navigate(key);
                    }}
                >
                    <TabBar.Item key="/tree" icon={<span style={{ fontSize: 20 }}>🌳</span>} title="心情树" />
                    <TabBar.Item key="/record" icon={<span style={{ fontSize: 20 }}>📝</span>} title="心情记录" />
                    <TabBar.Item key="/encouragement" icon={<span style={{ fontSize: 20 }}>💬</span>} title="每日鼓励" />
                    <TabBar.Item key="/my" icon={<span style={{ fontSize: 20 }}>�</span>} title="我的" />
                </TabBar>
            </div>
        </div>
    );
}