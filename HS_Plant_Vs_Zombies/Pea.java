import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
/**
 * Write a description of class Pea here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Pea extends Actor
{
    private GifImage image = new GifImage("pea.gif");
    private final int wait = 2;
    private boolean changed, hit = false;
    private int delay = 0;
    /**
     * Act - do whatever the Pea wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public Pea()
    {
        setImage(image.getCurrentImage());
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            setImage(image.getCurrentImage());
            if( (getX() >= 797 || delay > wait) && !changed)
            {
                image = new GifImage("PeaBulletHit.gif");
                changed = true;
            }
            if(getOneObjectAtOffset( 0, 0, Zombie.class) != null )
            {
                if(!hit && !((Zombie)(getOneObjectAtOffset( 0, 0, Zombie.class))).isDead())
                {
                    ((Zombie)(getOneObjectAtOffset( 0, 0, Zombie.class))).loseHealth();
                    hit = true;
                }
            }
            if(hit)
            {
                delay++;
            }
            setLocation(getX() + 10, getY());
            if(delay > wait + 10|| getX() >= 799)
            {
                getWorld().removeObject(this);
            }
        }
    }    
}
