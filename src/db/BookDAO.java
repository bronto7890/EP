package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import models.Book;
;
public class BookDAO {
	Book oneBook = null;
	Connection conn = null;
    Statement stmt = null;
	String user = "maibaumb";
    String password = "EfVefroit6";
    // Note none default port used, 6306 not 3306
    String url = "jdbc:mysql://mudfoot.doc.stu.mmu.ac.uk:6306/" + user;
	
	private void openConnection(){
		// loading jdbc driver for mysql
		try{
		    Class.forName("com.mysql.cj.jdbc.Driver").getDeclaredConstructor().newInstance();
		} catch(Exception e) { System.out.println(e); }

		// connecting to database
		try{
			// connection string for demos database, username demos, password demos
 			conn = DriverManager.getConnection(url, user, password);
		    stmt = conn.createStatement();
		} catch(SQLException se) { 
			System.out.println(se);
		}
    }
	
	private void closeConnection(){
		try {
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private Book getNextBook(ResultSet rs){
    	Book thisBook=null;
		try {
			thisBook = new Book(
				rs.getInt("id"),
				rs.getString("title"),
				rs.getString("author"),
				rs.getString("date"),
				rs.getString("genres"),
				rs.getString("characters"),
				rs.getString("synopsis"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
    	return thisBook;		
	}
	
   public ArrayList<Book> getAllBooks(){
		ArrayList<Book> allBooks = new ArrayList<Book>();
		openConnection();
	    // Create select statement and execute it
		try{
		    String selectSQL = "select * from books";
		    ResultSet rs1 = stmt.executeQuery(selectSQL);
	    // Retrieve the results
		    while(rs1.next()){
		    	oneBook = getNextBook(rs1);
		    	allBooks.add(oneBook);
		   }
		    stmt.close();
		    closeConnection();
		} catch (SQLException se) { 
			System.out.println(se); 
		}
	   return allBooks;
   }
   
   public ArrayList<Book> getBookId(int id) {
	   ArrayList<Book> books = new ArrayList<Book>();
	   openConnection();
	   try {
		   PreparedStatement ps = conn.prepareStatement("select * from books where id = ?;");
		   ps.setInt(1, id);
		   ResultSet rs = ps.executeQuery();
		   while(rs.next()){
		    	oneBook = getNextBook(rs);
		    	books.add(oneBook);
		   }
		   ps.close();
		   closeConnection();
	   } catch (SQLException se) { 
		   System.out.println(se);
	   }
	   return books;
   }
   
   public ArrayList<Book> searchBook(String search) {
	   ArrayList<Book> books = new ArrayList<Book>();
	   openConnection();
	   try {
		   PreparedStatement ps = conn.prepareStatement("select * from books where title = ?;");
		   ps.setString(1, search);
		   ResultSet rs = ps.executeQuery();
		   while(rs.next()){
		    	oneBook = getNextBook(rs);
		    	books.add(oneBook);
		   }
		   ps.close();
		   closeConnection();
	   } catch (SQLException se) { 
		   System.out.println(se);
	   }
	   closeConnection();
	   return books;
   }
   
   public int maxId() {
	   int maxId = 0;
	   ArrayList<Book> books = new ArrayList<Book>();
	   openConnection();
	   try {
		   String query = "select MAX(id) from books;";
		   ResultSet rs = stmt.executeQuery(query);
		   while (rs.next()) {
			   maxId = rs.getInt(1);
		   }
		   stmt.close();
		   closeConnection();
	   } catch(SQLException se) { 
		   System.out.println(se);
	   }
	   return maxId;
   }
   
   public void insertBook(Book b) throws SQLException {
	   openConnection();
	   try {
		   PreparedStatement ps = conn.prepareStatement("insert into books (id, title, author, date, genres, characters, synopsis) values (?, ?, ?, ?, ?, ?, ?);");
		   ps.setInt(1, b.getId());
		   ps.setString(2, b.getTitle());
		   ps.setString(3, b.getAuthor());
		   ps.setString(4, b.getDate());
		   ps.setString(5, b.getGenres());
		   ps.setString(6, b.getCharacters());
		   ps.setString(7, b.getSynopsis());
		   ps.execute();
		   ps.close();
		   closeConnection();
	   } catch(SQLException se) { 
		   System.out.println(se);
	   }
   }
   //UPDATE employees SET name = ?, salary = ? WHERE id = ?
   public void updateBook(ArrayList<Book> books) throws SQLException {
	   Book b = books.get(0);
	   openConnection();
	   try {
		   PreparedStatement ps = conn.prepareStatement("update books set id = ?, title = ?, author = ?, date = ?, genres = ?, characters = ?, synopsis = ? where id = ?;");
		   ps.setInt(1, b.getId()+2);
		   ps.setString(2, b.getTitle());
		   ps.setString(3, b.getAuthor());
		   ps.setString(4, b.getDate());
		   ps.setString(5, b.getGenres());
		   ps.setString(6, b.getCharacters());
		   ps.setString(7, b.getSynopsis());
		   ps.setInt(8, b.getId());
		   ps.executeUpdate();
		   ps.close();
		   closeConnection();
	   } catch(SQLException se) { 
		   System.out.println(se);
	   }
	   closeConnection();
   }

   public void deleteBook(int id) throws SQLException {
	   openConnection();
	   try {
		   PreparedStatement ps = conn.prepareStatement("delete from books where id = ?;");
		   ps.setInt(1, id);
		   ps.executeUpdate();
		   ps.close();
		   closeConnection();
	   } catch(SQLException se) { 
		   System.out.println(se);
	   }
   }
   
}
