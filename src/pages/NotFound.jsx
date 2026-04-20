import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center justify-center h-screen px-4 text-center' style={{ background: 'var(--color-background)' }}>
            <div className='flex flex-col items-center gap-6 max-w-md'>
                <div className='flex flex-col gap-2'>
                    <span className='text-8xl font-bold leading-none' style={{ color: 'var(--color-primary)' }}>404</span>
                    <h1 className='text-2xl font-bold' style={{ color: 'var(--color-foreground)' }}>Page not found</h1>
                    <p className='text-base' style={{ color: 'var(--color-muted)' }}>
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>
                <Button onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} className='mr-1' />
                    Go back
                </Button>
            </div>
        </div>
    );
}
