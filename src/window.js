const MINIMUM_WIDTH = 300;
const MINIMUM_HEIGHT = 200;

/**
 * @file window.js
 * @description A container that can be moved around like a desktop window.
 */
class Window
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width || MINIMUM_WIDTH;
        this.height = height || MINIMUM_HEIGHT;
        this.moving = false;
        this.resizing = false;
        this.movingOffsetX = 0;
        this.movingOffsetY = 0;
        this.isFullscreen = false;

        this.createHTML();
        this.move();
        this.resize();
    }

    createHTML()
    {
        // Container
        this.containerHTML = document.createElement('div');
        this.containerHTML.className = 'sprint-window';

        // Handle
        this.handleHTML = document.createElement('div');
        this.handleHTML.className = 'sprint-window-handle';
        document.addEventListener('mousemove', (e) => this.onHandleHover(e));
        this.handleHTML.onmousedown = (e) => this.onHandleMouseDown(e);
        document.addEventListener('mouseup', (e) => this.onHandleMouseUp(e));

        // Close
        this.closeHTML = document.createElement('input');
        this.closeHTML.className = 'sprint-window-close';
        this.closeHTML.type = 'button';
        this.closeHTML.value = 'x';
        this.closeHTML.onclick = () => { this.close() }

        // Body
        this.bodyHTML = document.createElement('div');
        this.bodyHTML.className = 'sprint-window-body';
        document.addEventListener('mousemove', (e) => this.onBodyHover(e));
        this.bodyHTML.onmousedown = (e) => this.onBodyMouseDown(e);
        document.addEventListener('mouseup', (e) => this.onBodyMouseUp(e));

        // Little nub to show resize
        this.resizeHTML = document.createElement('div');
        this.resizeHTML.className = 'sprint-window-resize';

        // Put it all together
        document.body.appendChild(this.containerHTML);
        this.containerHTML.appendChild(this.handleHTML);
        this.containerHTML.appendChild(this.closeHTML);
        this.containerHTML.appendChild(this.bodyHTML);
        this.bodyHTML.appendChild(this.resizeHTML);
    }

    close()
    {
        this.containerHTML.remove();
    }

    resize()
    {
        if (this.width < MINIMUM_WIDTH)
        {
            this.width = MINIMUM_WIDTH;
        }
        if (this.height < MINIMUM_HEIGHT)
        {
            this.height = MINIMUM_HEIGHT;
        }
        this.containerHTML.style.width = this.width + 'px';
        this.containerHTML.style.height = this.height + 'px';
    }

    move()
    {
        if (this.x + this.width > window.innerWidth)
        {
            this.x = window.innerWidth - this.width;
        }
        if (this.y + this.height > window.innerHeight)
        {
            this.y = window.innerHeight - this.height;
        }
        if (this.x < 0)
        {
            this.x = 0;
        }
        if (this.y < 0)
        {
            this.y = 0;
        }

        this.containerHTML.style.top = this.y + 'px';
        this.containerHTML.style.left = this.x + 'px';
    }

    fullscreen()
    {
        this.isFullscreen = true;
        this.x = 0;
        this.y = 0;
        this.move();
        this.containerHTML.style.width = window.innerWidth + 'px';
        this.containerHTML.style.height = window.innerHeight + 'px';
    }

    onHandleHover(e)
    {
        if (!this.moving)
        {
            return;
        }
        this.isFullscreen = this.y < 3;

        this.x = e.clientX - this.movingOffsetX;
        this.y = e.clientY - this.movingOffsetY;
        this.move();
    }

    onHandleMouseDown(e)
    {
        e.preventDefault();
        if (this.isFullscreen)
        {
            this.isFullscreen = false;
            this.x = e.clientX - this.width / 2;
            this.resize();
            this.move();
        }
        this.movingOffsetX = e.clientX - this.x;
        this.movingOffsetY = e.clientY - this.y;        
        this.moving = true;
    }

    onHandleMouseUp(e)
    {
        this.moving = false;
        if (this.isFullscreen)
        {
            this.fullscreen();
        }
    }

    onBodyHover(e)
    {
        if (!this.resizing)
        {
            return;
        }
        this.width = e.clientX - this.x + 5;
        this.height = e.clientY - this.y + 5;

        if (this.x + this.width > window.innerWidth)
        {
            this.width = window.innerWidth - this.x;
        }
        if (this.y + this.height > window.innerHeight)
        {
            this.height = window.innerHeight - this.y;
        }
        this.resize();
    }

    onBodyMouseDown(e)
    {
        if ((e.clientX > this.x + this.width - 20) && (e.clientY > this.y + this.height - 20))
        {
            e.preventDefault();
            this.isFullscreen = false;
            this.resizing = true;
        }
    }

    onBodyMouseUp(e)
    {
        this.resizing = false;
    }

    setBody(element)
    {
        this.bodyHTML.innerHTML = element;
    }
}

export default Window;