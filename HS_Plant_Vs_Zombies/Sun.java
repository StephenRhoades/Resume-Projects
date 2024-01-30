import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Sun here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Sun extends Actor
{
    private GifImage gifImage;
    private double x, y, t, v, inc, angle, distance, max;
    private int ground, getX, getY;
    private final double pi = Math.PI;
    private MouseInfo ms;
    public Sun(int a, int b, boolean falling)
    {
        x = a;
        y = b;
        t = 0;
        getX = a;
        getY = b;
        distance = Math.random()*2.0 + 3.0;
        if(!falling)
        {
            angle = (Math.random()/6.0)+ 1.0/3.0;
            if(angle > (0.5 - 1/12.0) )
            {
                angle += 1/12.0;
            }
            else
            {
                angle -= 1/12.0;
            }
            if(angle < 5.2 && angle > 4.8)
            {
                if(Math.random() > 5.0)
                {
                    angle -= 1/12.0;
                }
                else
                {
                    angle += 1/12.0;
                }
            }
            v = 40;
            inc = 0.03;
            max = 15.0;
        }
        else
        {
            angle = 1.5;
            v = 40;
            inc = 0.02;
            max = 12.0;
        }
        ground = b + 80;
        gifImage = new GifImage("Sun.gif");
        setImage(gifImage.getCurrentImage());
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            ms = Greenfoot.getMouseInfo();
            setImage(gifImage.getCurrentImage());
            t+= 0.03;
            if(t < distance && getY() < 569)
            {
                x = getX + v * Math.cos(pi*(angle)) * t;
                y = getY-((v * Math.sin(pi*(angle)) * t) - (16 * t * t));
                setLocation((int)(x), (int)(y));
            }
            if(t > max)
            {
                getWorld().removeObject(this);
            } 
            else if((ms != null) && Greenfoot.mouseClicked(this) && !(isTouching(Placer.class)))
            {
                Menu.setSun(Menu.getSun() + 25);
                getWorld().removeObject(this);
            }
        }
    }   
}
