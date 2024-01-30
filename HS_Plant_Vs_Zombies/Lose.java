import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Lose here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Lose extends Actor
{
    private GreenfootImage currentImage, image;
    private int dark;
    public Lose()
    {
        image = new GreenfootImage("ZombiesWon.png");
        dark = 1;
    }
    public void act() 
    {
        if(dark < 250)
        {
            currentImage = new GreenfootImage("map_blank.png");
            
            for(int y = 0; y < currentImage.getHeight(); y++ )
            {
                for(int x = 0; x < currentImage.getWidth(); x++ )
                {
                    Color c = currentImage.getColorAt(x,y);
                    if (c.getAlpha() < dark)
                    {
                        c = new Color(0,0,0,dark);
                        currentImage.setColorAt(x, y, c);
                    }
                }
            }
            currentImage.drawImage(image, 118, 66);
            dark += 6;
            setImage(currentImage);
        }
        else
        {
            World world = new OpenMenu();
            Greenfoot.setWorld(world);
            FrontYard.isPlaying();
        }
    }    
}
