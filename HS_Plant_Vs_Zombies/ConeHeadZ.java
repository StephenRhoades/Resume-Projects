import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class ConeHeadZ here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class ConeHeadZ extends Zombie
{
    public ConeHeadZ()
    {
        super(new GifImage("ConeheadZombie.gif"), new GifImage("ZombieLostHead.gif"), new GifImage("ZombieLostHeadAttack.gif"),
        new GifImage("ConeheadZombieAttack.gif"), new GifImage("ZombieDie.gif"), 10, 18, 5);
    }
    public void act() 
    {
        super.act();
    }    
    public void die2()
    {
        super.die2();
        ZombieHead head = new ZombieHead(getX(), getY()-34, new GreenfootImage("cone1.png"));
        getWorld().addObject(head, getX() + 7, getY()-44);
    }
    public void die()
    {
        super.die();
        FrontYard.incScore(3);
    }
}
