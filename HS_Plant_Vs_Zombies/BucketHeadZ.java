import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class BucketHeadZ here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class BucketHeadZ extends Zombie
{
    public BucketHeadZ()
    {
        super(new GifImage("BucketheadZombie.gif"), new GifImage("ZombieLostHead.gif"), new GifImage("ZombieLostHeadAttack.gif"),
        new GifImage("BucketheadZombieAttack.gif"), new GifImage("ZombieDie.gif"), 10, 55, 5);
    }
    public void act() 
    {
        super.act();
    }    
    public void die()
    {
        super.die();
        FrontYard.incScore(10);
    }
    public void die2()
    {
        super.die2();
        ZombieHead head = new ZombieHead(getX(), getY()-34, new GreenfootImage("bucket.png"));
        getWorld().addObject(head, getX() + 7, getY()-44);
    }
}
