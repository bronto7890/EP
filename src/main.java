import java.sql.SQLException;
import java.util.ArrayList;

import db.*;
import models.*;

public class main {

	public static void main(String[] args) {
		BookDAO bd = new BookDAO();
		//makeBook(bd);
		updateBook(bd, bd.getBookId(2449));
		System.out.println("finished");
		//System.out.println(bd.getAllBooks());
	}
	
	public static void makeBook(BookDAO bd) {
		Book b = new Book(bd.maxId()+1, "test", "test", "test", "test", "test", "test");
		try {
			bd.insertBook(b);
			System.out.println("inserted book at id: "+bd.maxId());
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void updateBook(BookDAO bd, ArrayList<Book> b) {
		try {
			bd.updateBook(b);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void deleteBook(BookDAO bd, int id) {
		try {
			bd.deleteBook(id);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
