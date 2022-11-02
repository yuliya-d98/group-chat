import { FC, memo } from 'react';
import '../styles/preloader.scss';

type PreloaderProps = {
  // isActive: boolean;
  size: number | string;
};

const Preloader: FC<PreloaderProps> = memo(({ size }) => {
  return (
    <div className="preloader__background">
      <div className="preloader" style={{ width: `${size}px`, height: `${size}px` }}></div>;
    </div>
  );
});

export default Preloader;
