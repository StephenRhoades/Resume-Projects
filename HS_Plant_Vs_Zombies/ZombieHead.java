import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class ZombieHead here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class ZombieHead extends Actor
{
    private double x, y, t, v, rot, ran;
    private int ground, getX, getY, trans;
    private boolean fade;
    private final double pi = Math.PI;
    /**
     * Act - do whatever the ZombieHead wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public ZombieHead(int a, int b, GreenfootImage image)
    {
        x = a;
        y = b;
        t = 0;
        v = Math.random() * 10 + 15;
        ran = Math.random() * 30 - 15;
        rot = getRotation() ;
        fade = false;
        getX = a;
        getY = b;
        ground = b + 80;
        trans = 250;
        setImage(image);
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            if(getY()>= ground || getY()>= 569)
            {
                fade = true;
            }
            if(fade)
            {
                fade();
            }else 
            {
                rot = getRotation() + ran;
                setLocation((int)(x), (int)(y));
                t+= .1;
                x = getX + v * Math.cos(pi/3.0) * t;
                y = getY-((v * Math.sin(pi/3.0) * t) - (16 * t * t));
                setRotation((int)(rot));
            }
            if(trans < 5)
            {
                getWorld().removeObject(this);
            }
        }        
    }    
    public void fade()
    {
        trans--;
        getImage().setTransparency(trans);
    }
}
