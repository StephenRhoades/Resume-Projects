import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Menu here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Menu extends Actor
{
    private static int sun, prevSun;
    private GreenfootImage image;
    private GreenfootImage alt;
    private GreenfootImage dark;
    private int prev;
    private static int time = 751;
    private double coolDown = 7.5;
    public Menu()
    {
        image = new GreenfootImage("Menu.png");
        image.scale(450, 80);
        sun = 50;
        image.drawString(sun + "", 30, 70);
        setImage(image);
        prevSun = sun;
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
           if(sun > 1000)
           {
               sun = 1000;
           }
           if(prevSun != sun)
           {
               image = new GreenfootImage("Menu.png");
               image.scale(450, 80);
               if(sun == 1000)
               image.drawString(sun + "", 22, 70);
               else if(sun >99)
               image.drawString(sun + "", 26, 70);
               else
               image.drawString(sun + "", 30, 70);
               setImage(image);
               prevSun = sun;
            }
        }
    }    
    public static int getSun() 
    {
        return sun;
    }
    public static void setSun(int num) 
    {
        sun = num;
    }
    public static GreenfootImage shade(GreenfootImage imag)
    {
        for(int y = 0; y < imag.getHeight(); y++ )
        {
            for(int x = 0; x < imag.getWidth(); x++ )
            {
                Color c = imag.getColorAt(x,y);
                if(c.getRed() - 50 >= 0)
                {
                    c = new Color(c.getRed() - 50, c.getGreen(), c.getBlue());
                }
                else
                {
                    c = new Color(0, c.getGreen(), c.getBlue());
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
                    c = new Color(c.getRed(), c.getGreen(), c.getBlue() - 50);
                }
                else
                {
                    c = new Color(c.getRed(), c.getGreen(), 0);
                }
                imag.setColorAt(x, y, c);
            }
        }
        return imag;
    }
    public static GreenfootImage shade(GreenfootImage image, double time, double cool)
    {
        GreenfootImage imag = image;
        for(int y = 0; y < imag.getHeight() * ((cool-time)/cool); y++ )
        {
            for(int x = 0; x < imag.getWidth(); x++ )
            {
                Color c = imag.getColorAt(x,y);
                if(c.getRed() - 50 >= 0)
                {
                    c = new Color(c.getRed() - 50, c.getGreen(), c.getBlue());
                }
                else
                {
                    c = new Color(0, c.getGreen(), c.getBlue());
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
                    c = new Color(c.getRed(), c.getGreen(), c.getBlue() - 50);
                }
                else
                {
                    c = new Color(c.getRed(), c.getGreen(), 0);
                }
                imag.setColorAt(x, y, c);
            }
        }
        return imag;
    }
}
