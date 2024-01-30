import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Placer here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Placer extends PlacementGrid
{
    private GreenfootImage image, alt;
    private Place place;
    private boolean start = true;
    public Placer(GreenfootImage imag)
    {
        String temp = imag.toString();
        temp = temp.substring(temp.indexOf(":") + 2, temp.indexOf(".") + 4);
        image = new GreenfootImage(temp);
        alt = new GreenfootImage(temp);
        for(int y = 0; y < image.getHeight(); y++ )
        {
            for(int x = 0; x < image.getWidth(); x++ )
            {
                Color c = image.getColorAt(x,y);
                if(c.getAlpha() > 1)
                {
                    if(c.getRed() + 50 <= 255)
                    {
                        c = new Color(c.getRed() + 50, c.getGreen(), c.getBlue());
                    }
                    else
                    {
                        c = new Color(255, c.getGreen(), c.getBlue());
                    }
                    if(c.getGreen() - 50 >= 0)
                    {
                        c = new Color(c.getRed(), c.getGreen() - 50, c.getBlue());
                    }
                    else
                    {
                        c = new Color(c.getRed(), 0, c.getBlue());
                    }
                    if(c.getBlue() - 50 >= 0)
                    {
                        c = new Color(c.getRed(), c.getGreen() , c.getBlue()- 50);
                    }
                    else
                    {
                        c = new Color(c.getRed(), c.getGreen(), 0);
                    }
                }
                image.setColorAt(x, y, c);
            }
        }
        setImage(alt);
        place = new Place(image);
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            if(start)
            {
                getWorld().addObject(place, getX(), getY());
                start = false;
            }
            MouseInfo ms = Greenfoot.getMouseInfo();
            if(ms != null)
            {
                setLocation(ms.getX(), ms.getY());
                if(place.isTouching())
                {
                    setImage(image);
                }
                else
                {
                    setImage(alt);
                }
                if(ms.getClickCount() > 0 || Greenfoot.mousePressed(this))
                {
                    getWorld().removeObject(this);
                }
            }
        }
    }    
}
