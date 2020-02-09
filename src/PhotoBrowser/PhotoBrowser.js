import React, { Component } from 'react';
import Portal from './Portal/Portal';
import classNames from './style.module.scss';
import FullScreen from './FullScreen/FullScreen';

var throttle = require('lodash.throttle');
  
const arraysEqual = (array1, array2) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
}

export default class PhotoBrowser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            images: [],
            currentImage: 0,
            fullscreen: false,
            showDescription: true
        }
        this.throttleKeyDown = throttle(this.handleKeyDown, 200);
        this.throttleMouseMove = throttle(this.handleMouseMove, 200);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isOpen !== this.props.isOpen) {
            this.setState({ isOpen: this.props.isOpen }, () => {
                if(this.state.isOpen) {
                    document.body.style = 'overflow:hidden';
                    this.setShowDescription();
                    document.addEventListener('keydown', this.throttleKeyDown);
                    document.addEventListener('mousemove', this.throttleMouseMove);
                }
                else {
                    console.log('remove');
                    document.body.style = 'overflow:auto';
                    document.removeEventListener('keydown', this.throttleKeyDown);
                    document.removeEventListener('mousemove', this.throttleMouseMove);
                }
            })
        }
        if(!arraysEqual(this.props.images, prevProps.images)) {
            this.setState({ images: this.props.images });
        }
        if(prevProps.currentImage !== this.props.currentImage) {
            this.setState({ currentImage: this.props.currentImage })
        }
    }

    close = () => this.setState({ fullscreen: false }, () => { if(this.props.onClose) this.props.onClose() });

    closeBackdrop = () => {
        if(this.props.closeByBackdrop) {
            if(this.props.onClose) this.props.onClose();
        }
    }

    next = (e) => {
        if(e) e.stopPropagation();
        if(this.state.currentImage < this.state.images.length - 1) {
            this.setState({currentImage: this.state.currentImage + 1})
        }
    }

    prev = (e) => {
        if(e) e.stopPropagation();
        if(this.state.currentImage > 0) {
            this.setState({currentImage: this.state.currentImage - 1})
        }
    }

    fullscreen = (fullscreen) => this.setState({ fullscreen }, () => {
        if(this.state.fullscreen) this.setShowDescription();
    });

    checkFirst = () => this.state.currentImage > 0;

    checkLast = () => this.state.currentImage < this.state.images.length - 1;

    handleKeyDown = (e) => {
        if(e.which === 39) this.next();
        if(e.which === 37) this.prev();
        if(e.which === 27) this.close();
    }

    handleMouseMove = (e) => {
        this.setShowDescription();
    }

    setShowDescription = () => {
        clearTimeout(this.timerShow);
        this.setState({ showDescription: true }, () => {
            if(this.state.fullscreen) {
                this.timerShow = setTimeout(() => {
                    this.setState({ showDescription: false })
                }, 1500);
            }
        });
    }

    getShow() {
        if(this.state.showDescription) return classNames.block;
        else return classNames.hidden;
    }

    render() {
        let { isOpen, images, currentImage, fullscreen } = this.state;
        const { betweenText, showCount } = this.props;
        const closeIcon = {backgroundImage: `url(${require('./img/close.png')})`};
        const fullscreenOpenIcon = {backgroundImage: `url(${require('./img/fullscreen.png')})`};
        const fullscreenCloseIcon = {backgroundImage: `url(${require('./img/fullscreen_close.png')})`};
        const arrowIcon = {backgroundImage: `url(${require('./img/arrow.png')})`};
        const containerStyle = {top: fullscreen ? 0 : window.pageYOffset, backgroundColor: fullscreen ? '#111' : 'rgba(0,0,0, 0.7)'}
        return(
            <Portal className={classNames['photo-browser']}>
                <FullScreen
                    enabled={fullscreen}
                    onChange={this.fullscreen}
                >
                    {isOpen ? <div className={classNames['photo-browser-container']} style={containerStyle} onClick={this.closeBackdrop}>
                        <div className={classNames['inner-container']}>
                            <div className={`${classNames.close} ${this.getShow()}`} onClick={this.close} style={closeIcon}/>
                            {fullscreen ?
                                <div className={`${classNames.fullscreen} ${this.getShow()}`} onClick={() => this.fullscreen(false)} style={fullscreenCloseIcon}/>
                                : 
                                <div className={`${classNames.fullscreen} ${this.getShow()}`} onClick={() => this.fullscreen(true)} style={fullscreenOpenIcon}/>
                            }
                            <img className={classNames.image} alt={images[currentImage].description} onClick={this.next} src={images[currentImage].src}/>
                            {this.checkFirst() && <div className={`${classNames.arrow} ${classNames.left} ${this.getShow()}`} onClick={this.prev}>
                                <div className={classNames.icon} style={arrowIcon}></div>
                            </div>}
                            {this.checkLast() && <div className={`${classNames.arrow} ${classNames.right} ${this.getShow()}`} onClick={this.next}>
                                <div className={classNames.icon} style={arrowIcon}></div>
                            </div>}
                            {showCount && images.length > 0 && <div className={`${classNames.count} ${this.getShow()}`}>{`${currentImage + 1} ${betweenText} ${images.length}`}</div>}
                            {images[currentImage].description && <div className={`${classNames.description} ${this.getShow()}`}>{images[currentImage].description}</div>}
                        </div>
                    </div>
                    :
                    null}
                </FullScreen>
            </Portal>
        )
    }
}

PhotoBrowser.defaultProps = {
    isOpen: false,
    images: [],
    onClose: () => {},
    onNext: () => {},
    onPrev: () => {},
    currentImage: 0,
    closeByBackdrop: false,
    betweenText: 'из',
    showCount: true,
    descriptionPositionX: 'left',
    descriptionPositionY: 'bottom',
    download: false
}