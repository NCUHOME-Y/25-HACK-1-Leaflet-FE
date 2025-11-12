import { useState } from 'react';
import { Button, Toast, Space, Tag } from 'antd-mobile';
import { getEncouragementMessage } from '../../services/encouragement.service';

export default function EncouragementPage() {
    const [todayEncouragement, setTodayEncouragement] = useState<string | null>(null);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetEncouragement = async () => {
        setIsLoading(true);
        try {
            const message = await getEncouragementMessage();
            setTodayEncouragement(message);
            setIsFetched(true);
            Toast.show({ content: '获取成功！', duration: 1500 });
        } catch (error) {
            console.error('获取鼓励语失败:', error);
            const errorMessage = error instanceof Error ? error.message : '网络错误';
            Toast.show({ content: `获取失败: ${errorMessage}`, duration: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
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
        </div>
    );
}