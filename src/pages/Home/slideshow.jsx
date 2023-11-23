import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Slideshow({ slides }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slideIndexes = slides.map((_, index) => index); // Tạo mảng chỉ số

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // Chuyển đổi ảnh mỗi 5 giây

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className={cx('element')}>
            <img className={cx('img-element')} src={slides[currentIndex]} alt="Slide" />
            <div className={cx('dots')}>
                {slideIndexes.map((index) => (
                    <div
                        key={index}
                        className={cx('dot', { active: index === currentIndex })}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Slideshow;
