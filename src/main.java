import java.sql.SQLException;
import java.util.ArrayList;

import book.*;
import data.jsonFunctions;

public class main {

	public static void main(String[] args) {
		bookDAO bd = new bookDAO();
		//makeBook(bd);
		//updateBook(bd, bd.getBookId(2452));
		//String list = jsonFunctions.toJson(bd.getBookId(1000));
		String list = jsonFunctions.toJson(bd.getAllBooks());
		jsonFunctions.fileWriter(list);
		System.out.println("finished");
		//System.out.println(bd.getAllBooks());
	}
	
	public static void makeBook(bookDAO bd) {
		book b = new book(bd.maxId()+1, "test", "test", "test", "test", "test", "test");
		try {
			bd.insertBook(b);
			System.out.println("inserted book at id: "+bd.maxId());
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public static void updateBook(bookDAO bd, ArrayList<book> b) {
		try {
			bd.updateBook(b);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public static void deleteBook(bookDAO bd, int id) {
		try {
			bd.deleteBook(id);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
